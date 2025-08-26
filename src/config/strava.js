// Strava API Configuration
export const STRAVA_CONFIG = {
  // You'll need to create a Strava app at https://www.strava.com/settings/api
  CLIENT_ID: process.env.REACT_APP_STRAVA_CLIENT_ID || 'YOUR_CLIENT_ID',
  CLIENT_SECRET: process.env.REACT_APP_STRAVA_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  AUTH_URL: 'https://www.strava.com/oauth/authorize',
  TOKEN_URL: 'https://www.strava.com/oauth/token',
  API_BASE_URL: 'https://www.strava.com/api/v3',
  SCOPE: 'read_all,activity:read_all,activity:write,profile:read_all'
};

// Strava OAuth2 authorization URL
export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: STRAVA_CONFIG.CLIENT_ID,
    redirect_uri: STRAVA_CONFIG.REDIRECT_URI,
    response_type: 'code',
    scope: STRAVA_CONFIG.SCOPE,
    approval_prompt: 'force'
  });
  
  return `${STRAVA_CONFIG.AUTH_URL}?${params.toString()}`;
};

// API endpoints
export const API_ENDPOINTS = {
  ATHLETE: '/athlete',
  ACTIVITIES: '/athlete/activities',
  ACTIVITY: '/activities',
  UPDATE_ACTIVITY: (id) => `/activities/${id}`,
  NEW_ACTIVITIES: '/athlete/activities?after='
};
