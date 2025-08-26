import React from 'react';
import { getAuthUrl } from '../config/strava';
import { Activity, Zap } from 'lucide-react';

const Login = () => {
  const handleStravaLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Strava Activity Namer
          </h1>
          <p className="text-gray-600">
            Connect your Strava account and generate custom names for your activities
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              What you can do:
            </h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Connect to your Strava account</li>
              <li>• Import new activities automatically</li>
              <li>• Generate custom names in different styles</li>
              <li>• Update your Strava activities with new names</li>
            </ul>
          </div>

          <button
            onClick={handleStravaLogin}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944c-.386.378-.386.99 0 1.368l.386.378c.386.378.99.378 1.376 0l.386-.378c.386-.378.386-.99 0-1.368l-.386-.378c-.386-.378-.99-.378-1.376 0l-.386.378z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2z"/>
              </svg>
              Connect with Strava
            </div>
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By connecting, you authorize this app to access your Strava data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
