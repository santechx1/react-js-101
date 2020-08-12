/* eslint-disable global-require */
import helmet from 'helmet';
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import boom from '@hapi/boom';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import axios from 'axios';
import serverRoutes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import getManifest from './getManifest';

dotenv.config();

const app = express();
const { ENV, PORT, API_URL } = process.env;
const dev = ENV === 'development';
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

if (dev) {
  console.log('Development config');
  const webpackConfig = require('../../webpack.config');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const serverConfig = {
    port: PORT,
    hot: true,
  };
  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${mainStyles}" type="text/css">
      <title>Video Player</title>
  </head>
  <body>
      <div id="app">${html}</div>
      <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="${mainBuild}" type="text/javascript"></script>
      <script src="${vendorBuild}" type="text/javascript"></script>
  </body>
  </html>
  `;
};

const renderApp = async (req, res) => {
  let initialState;
  const { email, name, id, token } = req.cookies;
  try {
    const { data, status } = await axios({
      url: `${API_URL}/api/movies`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'get',
    });
    if (!data || status !== 200) {
      initialState = {
        user: {},
        myList: [],
        trends: [],
        originals: [],
      };
    }
    initialState = {
      user: {
        email, name, id,
      },
      myList: [],
      trends: data.data.filter((movie) => movie.contentRating === 'PG' && movie._id),
      originals: data.data.filter((movie) => movie.contentRating === 'G' && movie._id),
    };
  } catch (error) {
    console.log(error);
    initialState = {
      user: {},
      myList: [],
      trends: [],
      originals: [],
    };
  }
  console.log(req.method, req.path, req.headers['user-agent']);
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const isLogged = (initialState.user.id);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes(isLogged))}
      </StaticRouter>
    </Provider>,
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
};

const THIRTY_DAYS_IN_MS = 2592000000;
const TWO_HOURS_IN_MS = 7200000;

app.post('/auth/sign-in', async (req, res, next) => {
  const { rememberMe } = req.body;
  passport.authenticate('basic', (error, data) => {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }
      req.login(data, { session: false }, async (err) => {
        if (err) {
          next(err);
        }
        const { token, ...user } = data;
        res.cookie('token', token, {
          httpOnly: !dev, // allow server only access
          secure: !dev,
          maxAge: rememberMe ? THIRTY_DAYS_IN_MS : TWO_HOURS_IN_MS,
        });

        res.status(200).json(user);
      });
    } catch (err) {
      next(err);
    }
  })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
  const { body: user } = req;
  try {
    const { data, status } = await axios({
      url: `${API_URL}/api/auth/sign-up`,
      method: 'post',
      data: { name: user.name, email: user.email, password: user.password },
    });
    if (!data || status !== 201) {
      next(boom.badImplementation());
    }
    res.status(201).json({
      name: user.name,
      email: user.email,
      id: data.id,
    });
  } catch (error) {
    next(error);
  }
});

app.get('*', renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server running on http://localhost:${PORT}`);
});
