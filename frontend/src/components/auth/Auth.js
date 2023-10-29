import Cookies from 'js-cookie';
import AuthApi from '../../apis/AuthApi';

// Function to check if the access token has expired
const isAccessTokenExpired = (accessTokenExpiry) => {
  if (typeof accessTokenExpiry == 'undefined' && accessTokenExpiry == null) {
    return true;
  }
  const expiryDate = new Date(accessTokenExpiry);
  const currentTime = new Date();
  return expiryDate <= currentTime;
};

// Function to handle token refresh
const handleTokenRefresh = async () => {
  const refreshTokenData = Cookies.get('refreshToken');
  if (refreshTokenData) {
    try {
      const parsedRefreshTokenData = JSON.parse(refreshTokenData);
      const refreshToken = parsedRefreshTokenData.token;
      try {
        // Send a request to refreshToken API to get new access and refresh tokens
        const newTokens = await AuthApi.refreshToken({ refreshToken });
        // Save the new tokens in cookies
        Cookies.set(
          'accessToken',
          JSON.stringify(newTokens.data.accessToken.token),
          {
            secure: true,
            sameSite: 'None',
            expires: new Date(newTokens.data.accessToken.expiry),
          }
        );
        Cookies.set(
          'refreshToken',
          JSON.stringify(newTokens.data.refreshToken.token),
          {
            secure: true,
            sameSite: 'None',
            expires: new Date(newTokens.data.refreshToken.expiry),
          }
        );
        return newTokens.data.accessToken.token;
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null; // Signal that token refresh failed
    }
  }
  return null; // No refresh token available
};

// Function to get the valid access token
const getAccessToken = async () => {
  const accessTokenData = Cookies.get('accessToken');
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
        // Clear the access token cookie
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        return null;
      }
    }
  } else {
    console.log('Failed to get access token');
  }

  return null; // No access token available
};

export { getAccessToken };
