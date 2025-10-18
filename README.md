# Store App - React Native

A React Native application demonstrating authentication, biometric security, product management, and offline functionality using the DummyJSON API.

## Features

- User authentication with token-based session management
- Auto-lock functionality after 10 seconds of inactivity or when app goes to background
- Biometric authentication (Touch ID/Face ID) with password fallback
- Product listing with category filtering
- Superadmin capabilities for product management
- Offline support with persistent caching
- Pull-to-refresh functionality

## Screens

1. **Login Screen** - Authentication with optional superadmin designation
2. **All Products Screen** - Complete product catalog with management controls
3. **Smartphones Screen** - Category-specific product listing

## Tech Stack

- React Native with TypeScript
- Expo Router for navigation
- React Query for data fetching and caching
- Redux Toolkit for state management
- MMKV for storage
- Expo Local Authentication for biometrics
- React Hook Form for form handling

## Setup and Installation

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd store-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm start
   ```

4. Run on your platform
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Demo Accounts

### Regular User

- Username: `emilys`
- Password: `emilyspass`
- Permissions: View products only

### Super Admin

- Username: `michaelw`
- Password: `michaelwpass`
- Permissions: View and delete products

## Project Structure

```
src/
├── api/              API client and endpoints
├── components/       Reusable UI components
├── hooks/            Custom React hooks
├── screens/          Application screens
├── store/            Redux store and slices
├── types/            TypeScript type definitions
└── utils/            Utility functions
```

## Configuration

### Category Selection

The Smartphones category is used for the category-specific screen.

### Superadmin Configuration

The superadmin user (michaelw) has delete permissions. This can be configured during login.

### Auto-lock Settings

Auto-lock timeout is set to 10 seconds and can be modified in `src/hooks/useAutoLock.ts`.

## Offline Functionality

The application handles offline scenarios through:

- Automatic API response caching via React Query
- Local storage with MMKV
- Network status detection
- Background data synchronization

## Security

- Secure token storage
- Biometric authentication with password fallback
- Auto-lock on inactivity
- Session validation

## EAS Build Configuration

The project includes EAS configuration for building preview and development versions.

### Preview Build

```bash
npm run eas:preview
```

### Development Build

```bash
npm run eas:development
npx expo start --dev-client
```

### Platform-Specific Builds

```bash
npm run build:android:preview
npm run build:ios:preview
```

## Testing

Install testing dependencies:

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

## License

MIT License
