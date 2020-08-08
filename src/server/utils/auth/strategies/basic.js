import { use } from 'passport';
import { BasicStrategy } from 'passport-http';
import { unauthorized } from '@hapi/boom';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const { API_URL, API_KEY_TOKEN } = process.env;
use(
  new BasicStrategy(async (email, password, cb) => {
    try {
      const { data, status } = await axios({
        url: `${API_URL}/api/auth/sign-in`,
        method: 'post',
        auth: {
          password,
          username: email,
        },
        data: {
          apiKeyToken: API_KEY_TOKEN,
        },
      });
      if (!data || status !== 200) {
        return cb(unauthorized(), false);
      }
      return cb(null, data);
    } catch (error) {
      cb(error);
    }
  }),
);
