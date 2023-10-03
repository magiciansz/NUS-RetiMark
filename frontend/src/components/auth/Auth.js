import Cookies from 'js-cookie';
import AuthApi from '../../apis/AuthApi';

// Function to check if the access token has expired
const isAccessTokenExpired = (accessTokenExpiry) => {
  console.log('access token expiry checking', accessTokenExpiry);
  if (!accessTokenExpiry) {
    return false;
  }
  const expiryDate = new Date(accessTokenExpiry);
  const currentTime = new Date();

  console.log('Expiry Date:', expiryDate);
  console.log('Current Time:', currentTime);
  return expiryDate <= currentTime;
};

// Function to handle token refresh
const handleTokenRefresh = async () => {
  console.log('checking token refresh');
  const refreshTokenData = Cookies.get('refreshToken');
  if (refreshTokenData) {
    try {
      // Send a request to your refresh token API to get new tokens
      const parsedRefreshTokenData = JSON.parse(refreshTokenData);
      const refreshToken = parsedRefreshTokenData.token;
      try {
        const newTokens = await AuthApi.refreshToken({ refreshToken });
        // Save the new tokens in cookies
        Cookies.set(
          'accessToken',
          JSON.stringify(newTokens.data.accessToken.token),
          {
            secure: true,
            sameSite: 'strict',
            expires: new Date(newTokens.data.accessToken.expiry),
          }
        );
        Cookies.set(
          'refreshToken',
          JSON.stringify(newTokens.data.refreshToken.token),
          {
            secure: true,
            sameSite: 'strict',
            //   httpOnly: true,
            expires: new Date(newTokens.data.refreshToken.expiry),
          }
        );
        return newTokens.data.accessToken.token;
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      // Handle any errors that occurred during token refresh
      console.error('Token refresh failed:', error);
      return null; // Signal that token refresh failed
    }
  }
  return null; // No refresh token available
};

// Function to get the valid access token
const getAccessToken = async () => {
  console.log('getting access tokens');
  const accessTokenData = Cookies.get('accessToken');
  console.log('accesstoken Data', accessTokenData);
  if (accessTokenData) {
    const parsedAccessTokenData = JSON.parse(accessTokenData);
    const accessToken = parsedAccessTokenData.token;
    const accessTokenExpiry = parsedAccessTokenData.expires;
    if (!isAccessTokenExpired(accessTokenExpiry)) {
      // Access token is still valid
      return accessToken;
    } else {
      const refreshedAccessToken = await handleTokenRefresh();
      if (refreshedAccessToken) {
        return refreshedAccessToken;
      } else {
        // Token refresh failed or no refresh token available, log the user out
        // Implement your logout logic here
        console.log('User logged out due to token expiration.');

        return null;
      }
    }
  }
  return null; // No access token available
};

export { getAccessToken };
