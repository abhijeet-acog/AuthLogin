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

## Email Authentication (via Gmail)

To enable authentication via email, you need to set up a Google App Password.

### Steps to Get a Google App Password
1. **Enable 2-Step Verification**
   - Go to [Google My Account Security](https://myaccount.google.com/security).
   - Under **"Signing in to Google"**, enable **2-Step Verification** (if not already enabled).

2. **Generate an App Password**
   - In the **"Signing in to Google"** section, click **App Passwords**.
   - Select **Mail** as the app and **Other (Custom name)**.
   - Enter a name (e.g., "NextAuth Email Login") and click **Generate**.
   - Copy the generated password (16-character string).

3. **Use the App Password in Your `.env.local`**
   - Set `GMAIL_APP_PASSWORD=your-generated-app-password` in your `.env.local`.


## Environment Variables

```env
# NextAuth Base URL
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth Credentials
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# LinkedIn OAuth Credentials
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Email Authentication (via Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password  # Not your personal password; must be generated via Google.

LDAP_URI=ldap://ldap.example.com
LDAP_USER_DN=ou=people,dc=example,dc=ai
```
