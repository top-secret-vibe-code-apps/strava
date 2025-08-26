# Strava Activity Namer

A React web application that connects to your Strava account, imports activities, and generates custom names for them. You can choose from different naming styles including funny, hard work, serious, and descriptive.

## Features

- 🔐 **Strava OAuth2 Integration** - Secure authentication with your Strava account
- 📥 **Automatic Activity Import** - Find and import new activities from Strava
- 🎨 **Multiple Naming Styles** - Choose from funny, hard work, serious, or descriptive
- ✏️ **Smart Name Generation** - Names are generated based on activity data (distance, time, elevation)
- 🔄 **Real-time Updates** - Update activity names directly in Strava
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Prerequisites

Before you can use this app, you need to:

1. **Create a Strava API Application**
   - Go to [Strava API Settings](https://www.strava.com/settings/api)
   - Create a new application
   - Note down your `Client ID` and `Client Secret`
   - Set the `Authorization Callback Domain` to `localhost` (for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StravaApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

4. **Start the development server**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Usage

1. **Connect to Strava**
   - Click "Connect with Strava" on the login page
   - Authorize the application to access your Strava data
   - You'll be redirected back to the dashboard

2. **Import Activities**
   - Click "Import New Activities" to fetch recent activities from Strava
   - The app will remember when you last imported to avoid duplicates

3. **Generate Names**
   - Select your preferred naming style from the dropdown
   - Click "Generate New Name" on any activity card
   - The new name will be automatically updated in Strava

## Naming Styles

- **Funny**: Creative and humorous names with emojis
- **Hard Work**: Motivational and achievement-focused names
- **Serious**: Professional and structured names
- **Descriptive**: Clear and informative names

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.js        # Login page with Strava OAuth
│   ├── AuthCallback.js # OAuth callback handler
│   └── Dashboard.js    # Main dashboard with activities
├── services/           # Business logic services
│   ├── stravaService.js    # Strava API integration
│   └── nameGenerator.js    # Name generation logic
├── config/             # Configuration files
│   └── strava.js      # Strava API configuration
└── App.js             # Main app component with routing
```

## API Endpoints Used

- `GET /athlete` - Get athlete profile
- `GET /athlete/activities` - Get athlete activities
- `PUT /activities/{id}` - Update activity name

## Technologies Used

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_STRAVA_CLIENT_ID` | Your Strava app client ID | Yes |
| `REACT_APP_STRAVA_CLIENT_SECRET` | Your Strava app client secret | Yes |
| `REACT_APP_REDIRECT_URI` | OAuth callback URL | Yes |

## Security Notes

- Client secrets are stored in environment variables (never commit them to version control)
- OAuth2 tokens are stored in localStorage (consider using httpOnly cookies for production)
- The app only requests necessary permissions (`read` and `activity:write`)

## Troubleshooting

### Common Issues

1. **"Invalid client_id" error**
   - Check your environment variables are set correctly
   - Verify your Strava app credentials

2. **"Redirect URI mismatch" error**
   - Ensure the redirect URI in your Strava app matches exactly
   - Check for trailing slashes or protocol differences

3. **Token expiration errors**
   - The app should automatically refresh tokens
   - If issues persist, try logging out and back in

### Getting Help

- Check the browser console for error messages
- Verify your Strava app settings
- Ensure all environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Strava API](https://developers.strava.com/) for providing the fitness data API
- [Create React App](https://create-react-app.dev/) for the project scaffolding
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

