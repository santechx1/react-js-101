import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import NotFound from '../containers/NotFound';
import Player from '../containers/Player';

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '/register',
    exact: true,
    component: Register,
  },
  {
    path: '/player/:id',
    exact: true,
    component: Player,
  },
  {
    name: 'NotFound',
    component: NotFound,
  },
];

export default routes;
