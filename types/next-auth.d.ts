import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubUrl?: string;
      linkedinUrl?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    githubUrl?: string;
    linkedinUrl?: string;
  }

  interface JWT {
    userId?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  }
} 