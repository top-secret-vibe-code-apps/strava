import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import stravaService from '../services/stravaService';
import { Loader2, CheckCircle, XCircle, Activity } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setError('Authorization was denied or failed');
          return;
        }

        if (!code) {
          setStatus('error');
          setError('No authorization code received');
          return;
        }

        // Exchange code for tokens
        const result = await stravaService.exchangeCodeForTokens(code);
        
        if (result === null) {
          // Token exchange was skipped (already in progress)
          setStatus('success');
        } else {
          setStatus('success');
        }

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setError(err.message || 'Failed to authenticate with Strava');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Connecting to Strava...
            </h2>
            <p className="text-gray-600 text-lg">
              Please wait while we authenticate your account
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Successfully Connected! 🎉
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Redirecting you to the dashboard...
            </p>
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {error}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-200/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Strava App
          </h1>
          <p className="text-gray-600 text-lg">
            Connecting your account...
          </p>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthCallback;
