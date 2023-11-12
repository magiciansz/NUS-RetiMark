import axios from 'axios';

// POST req to log a user in
async function login({ username, password }) {
  return axios.post(
    `${process.env.REACT_APP_EXPRESS_ENDPOINT_URL}/api/v1/auth/login?timezone=Asia/Singapore`,
    {
      username,
      password,
    }
  );
}

// POST req to get a new set of Access and Refresh Tokens
async function refreshToken({ refreshToken }) {
  return axios.post(
    `${process.env.REACT_APP_EXPRESS_ENDPOINT_URL}/api/v1/auth/refresh-tokens?timezone=Asia/Singapore`,
    {
      refreshToken,
    }
  );
}

export default {
  login,
  refreshToken,
};
