import Cookies from 'js-cookie';
import AuthApi from '../../apis/AuthApi';
// Function to check if the access token has expired
const isAccessTokenExpired = (accessTokenExpiry) => {
  //   console.log('checking if expired');
  //   const currentTime = Date.now() / 1000; // Convert to seconds
  //   console.log(
  //     'accessTokenExpiry <= currentTime',
  //     accessTokenExpiry <= currentTime
  //   );
  //   return accessTokenExpiry <= currentTime;
  console.log('Checking if expired');

  // Convert accessTokenExpiry to a Date object
  const expiryDate = new Date(accessTokenExpiry);

  // Get the current time as a Date object
  const timeNow = new Date();
  const currentTime = new Date(timeNow.getTime() + 3600 * 1000);

  // Compare the two Date objects
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
      console.log('sending req to refresh');
      const parsedRefreshTokenData = JSON.parse(refreshTokenData);
      console.log('parsed refresh', parsedRefreshTokenData);
      const refreshToken = parsedRefreshTokenData.token;
      console.log('refreshed', refreshToken);
      try {
        const newTokens = await AuthApi.refreshToken({ refreshToken });
        // Save the new tokens in cookies
        console.log('managed to get new tokens', newTokens);
        Cookies.set('accessToken', newTokens.accessToken.token, {
          secure: true,
          sameSite: 'strict',
          expires: new Date(newTokens.accessToken.expiry),
        });
        Cookies.set('refreshToken', newTokens.refreshToken.token, {
          secure: true,
          sameSite: 'strict',
          httpOnly: true,
          expires: new Date(newTokens.refreshToken.expiry),
        });
        return newTokens.accessToken.token;
      } catch (err) {
        console.error(err);
      }
      // return newTokens.accessToken.token; // Return the new access token
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
  if (accessTokenData) {
    const parsedAccessTokenData = JSON.parse(accessTokenData);
    const accessToken = parsedAccessTokenData.token;
    const accessTokenExpiry = parsedAccessTokenData.expires;
    console.log('before check if token has expired ');
    console.log('access expiry', accessTokenExpiry);
    if (!isAccessTokenExpired(accessTokenExpiry)) {
      // Access token is still valid
      console.log('token still valid?? ');

      return accessToken;
    } else {
      console.log('token expired, check refresh');
      // Access token has expired, try refreshing it
      const refreshedAccessToken = await handleTokenRefresh();
      if (refreshedAccessToken) {
        // Token refresh successful, return the new access token
        console.log('token refreshed succesfully');
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
