import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  if (!email.endsWith('@aganitha.ai')) {
    throw new Error('Only @aganitha.ai email addresses are allowed');
  }

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Aganitha Login Code',
    text: `Your login code is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Your Aganitha Login Code</h1>
        <p style="font-size: 18px; text-align: center;">
          Your login code is:
        </p>
        <p style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; margin: 24px 0;">
          ${otp}
        </p>
        <p style="color: #666; text-align: center;">
          This code will expire in 10 minutes.
        </p>
      </div>
    `,
  });
}