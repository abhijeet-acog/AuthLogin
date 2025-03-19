import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider, { LinkedInProfile } from "next-auth/providers/linkedin";
import CredentialsProvider from 'next-auth/providers/credentials';
import { createSession } from "@/utils/auth";
import { db } from "@/utils/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      profile: (profile: LinkedInProfile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        console.log('Authorizing with credentials:', credentials);

        if (!credentials?.email || !credentials?.otp || !credentials?.userId) {
          console.log('Missing credentials');
          return null;
        }

        const result = db.prepare(`
          SELECT * FROM otp_codes
          WHERE user_id = ?
          AND code = ?
          AND expires_at > datetime('now')
          AND used = FALSE
          LIMIT 1
        `).get(credentials.userId, credentials.otp);

        console.log('OTP query result:', result);

        if (!result) {
          console.log('Invalid OTP or expired');
          return null;
        }

        db.prepare(`
          UPDATE otp_codes
          SET used = TRUE
          WHERE id = ?
        `).run(result.id);

        const user = db.prepare('SELECT * FROM users WHERE id = ?')
          .get(credentials.userId);

        console.log('User query result:', user);

        if (!user) {
          console.log('User not found');
          return null;
        }

        await createSession(user.id);

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/test",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) {
        return false;
      }

      // Add custom profile data to the user object
      if (profile.email) {
        user.email = profile.email;
      }

      if (profile.name) {
        user.name = profile.name;
      }

      // Add provider-specific profile data
      if (account.provider === 'github') {
        //@ts-expect-error
        user.githubUrl = profile.html_url;
      }

      if (account.provider === 'linkedin') {
        //@ts-expect-error
        user.linkedinUrl = profile.publicProfileUrl;
      }

      // reject request if it does not match regex
      if (
        (account.provider === "google" || account.provider === "github") &&
        user.email
      ) {
        const emailRegex = /@aganitha\.ai$/;
        if (!emailRegex.test(user.email)) {
          return false; // Reject sign-in if email doesn't match the required domain
        }
      } else if (
        (account.provider === "google" || account.provider === "github") &&
        !user.email
      ) {
        return false; // Reject Google/GitHub sign-in if no email is provided
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        // Add provider-specific URLs if available

        if (user.githubUrl) {
          token.githubUrl = user.githubUrl;
        }
        if (user.linkedinUrl) {
          token.linkedinUrl = user.linkedinUrl;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
        // Add provider URLs to session if available
        if (token.githubUrl) {
          //@ts-expect-error
          session.user.githubUrl = token.githubUrl;
        }
        if (token.linkedinUrl) {
          //@ts-expect-error
          session.user.linkedinUrl = token.linkedinUrl;
        }
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
});

export { handler as GET, handler as POST }; 