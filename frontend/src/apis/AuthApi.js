import axios from 'axios';

async function login({ username, password }) {
  return axios.post(
    `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/auth/login?timezone=Asia/Singapore`,
    {
      username,
      password,
    }
  );
}

async function refreshToken({ refreshToken }) {
  console.log('in auth api', refreshToken);
  return axios.post(
    `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/auth/refresh-tokens?timezone=Asia/Singapore`,
    {
      refreshToken,
    }
  );
}

export default {
  login,
  refreshToken,
};
