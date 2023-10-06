import axios from 'axios';

async function login({ username, password }) {
  return axios.post(
    `http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/auth/login?timezone=Asia/Singapore`,
    {
      username,
      password,
    }
  );
}

async function refreshToken({ refreshToken }) {
  console.log('in auth api', refreshToken);
  return axios.post(
    `http://staging-alb-840547905.ap-southeast-1.elb.amazonaws.com/api/v1/auth/refresh-tokens?timezone=Asia/Singapore`,
    {
      refreshToken,
    }
  );
}

export default {
  login,
  refreshToken,
};
