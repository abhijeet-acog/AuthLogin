import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/utils/db';
import { randomUUID } from 'crypto';
import { config } from "dotenv";
config({path: ".env.emails"}); // Ensure env variables are loaded



const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-min-32-chars-long!!!'
);

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);

    console.log(token, "creating session token  ");
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return token;
}

export async function getSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;
    console.log(cookieStore, "cookieStore");
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: string };
  } catch {
    return null;
  }
}

export async function generateOTP(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = randomUUID();
    console.log('Generating OTP:', code, 'for email:', email);
  
    const stmt = db.prepare(`
      INSERT INTO users (id, email)
      VALUES (?, ?)
      ON CONFLICT(email) DO UPDATE SET
      email = excluded.email
      RETURNING id
    `);
  
    const user = stmt.get(userId, email) as { id: string };
    console.log('User ID for OTP:', user.id);
  
    db.prepare(`
      INSERT INTO otp_codes (id, user_id, code, expires_at)
      VALUES (?, ?, ?, datetime('now', '+10 minutes'))
    `).run(randomUUID(), user.id, code);
  
    return { code, userId: user.id };
  }
  
  export function verifyOTP(userId: string, code: string) {
    console.log('Verifying OTP:', code, 'for userId:', userId);
    const result = db.prepare(`
      SELECT * FROM otp_codes
      WHERE user_id = ?
      AND code = ?
      AND expires_at > datetime('now')
      AND used = FALSE
      LIMIT 1
    `).get(userId, code) as { id: string } | undefined;
  
    console.log('OTP query result:', result);
  
    if (result) {
      console.log('OTP is valid, marking as used');
      db.prepare(`
        UPDATE otp_codes
        SET used = TRUE
        WHERE id = ?
      `).run(result.id);
      return true;
    }
  
    console.log('OTP is invalid or expired');
    return false;
  }

export function isEmailAllowed(email: string) {
  const allowedEmails = process.env.ALLOWED_EMAILS;
  console.log("Loaded ALLOWED_EMAILS:", JSON.stringify(allowedEmails));
  if (!allowedEmails) {
    console.log("No allowed email patterns found in .env");
    return false;
  }

  // Split by newline, trim each line, and filter out empty entries
  // const patterns = allowedEmails.split("\n")
  //   .map(line => line.trim())
  //   .filter(line => line !== "");

  const patterns = allowedEmails.split(",").map(line => line.trim()).filter(line => line !== "");
  console.log("Allowed patterns:", patterns); // Debug log
  return patterns.some(pattern => new RegExp(pattern).test(email));
}