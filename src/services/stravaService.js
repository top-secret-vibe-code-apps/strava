import axios from 'axios';
import { STRAVA_CONFIG, API_ENDPOINTS } from '../config/strava';

class StravaService {
  constructor() {
    this.accessToken = localStorage.getItem('strava_access_token');
    this.refreshToken = localStorage.getItem('strava_refresh_token');
    this.tokenExpiry = localStorage.getItem('strava_token_expiry');
    this.isExchangingTokens = false; // Prevent duplicate token exchanges
  }

  // Check if token is expired
  isTokenExpired() {
    if (!this.tokenExpiry) return true;
    
    const currentTime = Date.now();
    const expiryTime = parseInt(this.tokenExpiry);
    const isExpired = currentTime > expiryTime;
    
    console.log('Token expiration check:', {
      currentTime: new Date(currentTime).toISOString(),
      expiryTime: new Date(expiryTime).toISOString(),
      isExpired,
      timeUntilExpiry: expiryTime - currentTime
    });
    
    return isExpired;
  }

  // Store tokens in localStorage
  storeTokens(accessToken, refreshToken, expiresAt) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = expiresAt;
    
    localStorage.setItem('strava_access_token', accessToken);
    localStorage.setItem('strava_refresh_token', refreshToken);
    localStorage.setItem('strava_token_expiry', expiresAt);
    
    console.log('💾 ===== TOKENS STORED =====');
    console.log('📱 Instance Variables Updated:');
    console.log('   • this.accessToken:', accessToken ? `${accessToken.substring(0, 10)}...` : 'undefined');
    console.log('   • this.refreshToken:', refreshToken ? `${refreshToken.substring(0, 10)}...` : 'undefined');
    console.log('   • this.tokenExpiry:', new Date(expiresAt).toISOString());
    console.log('💿 localStorage Updated:');
    console.log('   • strava_access_token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'undefined');
    console.log('   • strava_refresh_token:', refreshToken ? `${refreshToken.substring(0, 10)}...` : 'undefined');
    console.log('   • strava_token_expiry:', new Date(expiresAt).toISOString());
    console.log('✅ All storage locations updated successfully');
    console.log('===============================================');
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code) {
    try {
      // Prevent duplicate token exchanges
      if (this.isExchangingTokens) {
        console.log('Token exchange already in progress, skipping');
        return null;
      }

      // Check if we already have tokens (prevent duplicate exchange)
      if (this.accessToken && this.refreshToken) {
        console.log('Tokens already exist, skipping exchange');
        return { access_token: this.accessToken, refresh_token: this.refreshToken, expires_at: this.tokenExpiry / 1000 };
      }

      this.isExchangingTokens = true;
      console.log('Starting token exchange...');

      // Strava expects form data, not JSON
      const formData = new URLSearchParams();
      formData.append('client_id', STRAVA_CONFIG.CLIENT_ID);
      formData.append('client_secret', STRAVA_CONFIG.CLIENT_SECRET);
      formData.append('code', code);
      formData.append('grant_type', 'authorization_code');

      console.log('Sending token exchange request:', {
        url: STRAVA_CONFIG.TOKEN_URL,
        client_id: STRAVA_CONFIG.CLIENT_ID,
        code: code ? `${code.substring(0, 10)}...` : 'undefined',
        grant_type: 'authorization_code'
      });

      const response = await axios.post(STRAVA_CONFIG.TOKEN_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log('Token exchange response:', response.data);

      const { access_token, refresh_token, expires_at } = response.data;
      console.log('Token exchange successful:', { 
        access_token: access_token ? `${access_token.substring(0, 10)}...` : 'undefined',
        refresh_token: refresh_token ? `${refresh_token.substring(0, 10)}...` : 'undefined',
        expires_at 
      });
      
      this.storeTokens(access_token, refresh_token, expires_at * 1000);
      this.isExchangingTokens = false;
      
      console.log('🎉 ===== NEW OAUTH2 TOKENS CREATED =====');
      console.log('🔄 Token Exchange Process:');
      console.log('   • Authorization Code Used:', code ? `${code.substring(0, 10)}...` : 'None');
      console.log('   • New Access Token:', access_token ? `${access_token.substring(0, 10)}...` : 'None');
      console.log('   • New Refresh Token:', refresh_token ? `${refresh_token.substring(0, 10)}...` : 'None');
      console.log('   • Expires At:', new Date(expires_at * 1000).toISOString());
      console.log('   • Token Lifetime:', expires_at, 'seconds');
      console.log('✅ Tokens stored in localStorage and instance variables');
      console.log('===============================================');
      
      // Notify that authentication state has changed
      window.dispatchEvent(new Event('strava-auth-changed'));
      
      return response.data;
    } catch (error) {
      this.isExchangingTokens = false;
      console.error('Error exchanging code for tokens:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      // Strava expects form data, not JSON
      const formData = new URLSearchParams();
      formData.append('client_id', STRAVA_CONFIG.CLIENT_ID);
      formData.append('client_secret', STRAVA_CONFIG.CLIENT_SECRET);
      formData.append('refresh_token', this.refreshToken);
      formData.append('grant_type', 'refresh_token');

      const response = await axios.post(STRAVA_CONFIG.TOKEN_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token, expires_at } = response.data;
      this.storeTokens(access_token, refresh_token, expires_at * 1000);
      
      // Notify that authentication state has changed
      window.dispatchEvent(new Event('strava-auth-changed'));
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Get authenticated axios instance
  this getAuthenticatedInstance() {
    console.log('Getting authenticated instance:', {
      accessToken: this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'undefined',
      isExpired: this.isTokenExpired(),
      expiryTime: this.tokenExpiry ? new Date(parseInt(this.tokenExpiry)).toISOString() : 'none'
    });
    
    if (this.isTokenExpired()) {
      throw new Error('Token expired. Please re-authenticate.');
    }

    // Try to refresh token if it's close to expiring (within 5 minutes)
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    if (parseInt(this.tokenExpiry) < fiveMinutesFromNow) {
      console.log('Token expires soon, attempting refresh...');
      this.refreshAccessToken().catch(error => {
        console.error('Failed to refresh token:', error);
      });
    }

    const axiosInstance = axios.create({
      baseURL: STRAVA_CONFIG.API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('Created axios instance with headers:', {
      baseURL: STRAVA_CONFIG.API_BASE_URL,
      Authorization: `Bearer ${this.accessToken ? this.accessToken.substring(0, 10) + '...' : 'undefined'}`
    });
    
    return axiosInstance;
  }

  // Get athlete profile
  async getAthlete() {
    try {
      const api = this.getAuthenticatedInstance();
      console.log('Testing athlete endpoint with token:', this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'undefined');
      
      const response = await api.get(API_ENDPOINTS.ATHLETE);
      console.log('Athlete endpoint successful:', response.data);
      
      // Log detailed account information
      this.logAccountInfo(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error getting athlete:', error);
      console.error('Athlete endpoint error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Log the full error response for debugging
      if (error.response?.data) {
        console.error('Full Strava API athlete error response:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  // Log detailed account information
  logAccountInfo(athleteData) {
    console.log('🎯 ===== STRAVA ACCOUNT CONNECTION VERIFIED =====');
    console.log('✅ Successfully connected to Strava via OAuth2!');
    console.log('👤 Account Details:');
    console.log('   • Name:', athleteData.firstname, athleteData.lastname);
    console.log('   • Username:', athleteData.username || 'Not set');
    console.log('   • Strava ID:', athleteData.id);
    console.log('   • Profile Picture:', athleteData.profile ? 'Available' : 'Not set');
    console.log('   • Premium:', athleteData.premium ? 'Yes' : 'No');
    console.log('   • Summit:', athleteData.summit ? 'Yes' : 'No');
    console.log('   • City:', athleteData.city || 'Not set');
    console.log('   • State:', athleteData.state || 'Not set');
    console.log('   • Country:', athleteData.country || 'Not set');
    console.log('   • Sex:', athleteData.sex || 'Not specified');
    console.log('   • Weight:', athleteData.weight ? `${athleteData.weight}kg` : 'Not set');
    console.log('   • Resource State:', athleteData.resource_state);
    console.log('🔑 Token Information:');
    console.log('   • Access Token:', this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'None');
    console.log('   • Refresh Token:', this.refreshToken ? `${this.refreshToken.substring(0, 10)}...` : 'None');
    console.log('   • Token Expiry:', this.tokenExpiry ? new Date(parseInt(this.tokenExpiry)).toISOString() : 'None');
    console.log('   • Token Valid:', !this.isTokenExpired());
    console.log('🌐 API Configuration:');
    console.log('   • Client ID:', STRAVA_CONFIG.CLIENT_ID);
    console.log('   • Redirect URI:', STRAVA_CONFIG.REDIRECT_URI);
    console.log('   • API Base URL:', STRAVA_CONFIG.API_BASE_URL);
    console.log('   • Scope:', STRAVA_CONFIG.SCOPE);
    console.log('===============================================');
  }

  // Get activities
  async getActivities(page = 1, perPage = 30) {
    try {
      const api = this.getAuthenticatedInstance();
      console.log('Making activities request with token:', this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'undefined');
      
      const response = await api.get(API_ENDPOINTS.ACTIVITIES, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting activities:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Log the full error response for debugging
      if (error.response?.data) {
        console.error('Full Strava API error response:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  // Get new activities since last import
  async getNewActivities(afterTimestamp) {
    try {
      console.log('Getting new activities with timestamp:', afterTimestamp);
      const api = this.getAuthenticatedInstance();
      
      console.log('Making new activities request with token:', this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'undefined');
      
      const response = await api.get(`${API_ENDPOINTS.NEW_ACTIVITIES}${afterTimestamp}`);
      console.log('New activities request successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting new activities:', error);
      console.error('New activities error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Log the full error response for debugging
      if (error.response?.data) {
        console.error('Full Strava API new activities error response:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  // Update activity name
  async updateActivityName(activityId, newName) {
    try {
      const api = this.getAuthenticatedInstance();
      const response = await api.put(API_ENDPOINTS.UPDATE_ACTIVITY(activityId), {
        name: newName
      });
      return response.data;
    } catch (error) {
      console.error('Error updating activity name:', error);
      throw error;
    }
  }

  // Logout - clear tokens
  logout() {
    console.log('Logging out - clearing all tokens...');
    
    // Clear instance variables
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    
    // Clear localStorage
    localStorage.removeItem('strava_access_token');
    localStorage.removeItem('strava_refresh_token');
    localStorage.removeItem('strava_token_expiry');
    localStorage.removeItem('last_import_timestamp');
    
    // Clear any other potential strava items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('strava_')) {
        console.log('Removing localStorage item:', key);
        localStorage.removeItem(key);
      }
    });
    
    console.log('All tokens cleared. Current localStorage strava items:', 
      Object.keys(localStorage).filter(key => key.startsWith('strava_')));
    
    // Notify that authentication state has changed
    window.dispatchEvent(new Event('strava-auth-changed'));
  }

  // Test API connection
  async testApiConnection() {
    try {
      console.log('Testing API connection...');
      const api = this.getAuthenticatedInstance();
      
      // Try a simple GET request to test authentication
      const response = await api.get('/athlete');
      console.log('API connection test successful:', response.data);
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      console.error('Connection test error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      return false;
    }
  }

  // Force re-authentication by clearing tokens and redirecting
  forceReAuth() {
    console.log('Forcing re-authentication...');
    this.logout();
    
    // Redirect to login page
    window.location.href = '/';
  }

  // Check and display current connection status
  checkConnectionStatus() {
    console.log('🔍 ===== CURRENT CONNECTION STATUS =====');
    console.log('📱 Instance Variables:');
    console.log('   • this.accessToken:', this.accessToken ? `${this.accessToken.substring(0, 10)}...` : 'None');
    console.log('   • this.refreshToken:', this.refreshToken ? `${this.refreshToken.substring(0, 10)}...` : 'None');
    console.log('   • this.tokenExpiry:', this.tokenExpiry ? new Date(parseInt(this.tokenExpiry)).toISOString() : 'None');
    console.log('💿 localStorage:');
    console.log('   • strava_access_token:', localStorage.getItem('strava_access_token') ? `${localStorage.getItem('strava_access_token').substring(0, 10)}...` : 'None');
    console.log('   • strava_refresh_token:', localStorage.getItem('strava_refresh_token') ? `${localStorage.getItem('strava_refresh_token').substring(0, 10)}...` : 'None');
    console.log('   • strava_token_expiry:', localStorage.getItem('strava_token_expiry') ? new Date(parseInt(localStorage.getItem('strava_token_expiry'))).toISOString() : 'None');
    console.log('⏰ Token Status:');
    console.log('   • Token Expired:', this.isTokenExpired());
    console.log('   • Is Authenticated:', this.isAuthenticated());
    console.log('   • Current Time:', new Date().toISOString());
    console.log('===============================================');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const hasToken = !!this.accessToken;
    const isExpired = this.isTokenExpired();
    const expiryTime = this.tokenExpiry ? new Date(parseInt(this.tokenExpiry)).toISOString() : 'none';
    
    console.log('Auth check:', {
      hasToken,
      isExpired,
      expiryTime,
      currentTime: new Date().toISOString()
    });
    
    return hasToken && !isExpired;
  }
}

export default new StravaService();
