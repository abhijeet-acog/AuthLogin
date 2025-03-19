# Auth Login Component

A reusable authentication component that supports Google, GitHub, and LinkedIn login providers.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and fill in your OAuth credentials:
- For Google OAuth: [Google Cloud Console](https://console.cloud.google.com/)
- For GitHub OAuth: [GitHub Developer Settings](https://github.com/settings/developers)
- For LinkedIn OAuth: [LinkedIn Developer Portal](https://www.linkedin.com/developers/)

3. Configure your OAuth providers:

### Google Setup
1. Go to Google Cloud Console
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Configure the OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized redirect URI: `http://your-domain/api/auth/callback/google`

### GitHub Setup
1. Go to GitHub Developer Settings
2. Create a new OAuth App
3. Add homepage URL
4. Add callback URL: `http://your-domain/api/auth/callback/github`

### LinkedIn Setup
1. Go to LinkedIn Developer Portal
2. Create a new app
3. Add redirect URL: `http://your-domain/api/auth/callback/linkedin`

## Usage

```tsx
import AuthLogin from './components/AuthLogin';

// Basic usage
<AuthLogin />

// With custom callback URL
<AuthLogin callbackUrl="/dashboard" />

// With custom styling
<AuthLogin className="max-w-md mx-auto" />
```

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## Features

- Modern, responsive design
- Support for Google, GitHub, and LinkedIn authentication
- TypeScript support
- Tailwind CSS styling
- Easy to customize and extend
- Secure token handling
- Session management 