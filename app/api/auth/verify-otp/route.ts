import { NextResponse } from 'next/server';
import { verifyOTP, createSession } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { userId, otp } = await request.json();
    console.log('Received OTP verification request:', { userId, otp });

    if (!userId || !otp) {
      console.log('Missing userId or otp in request');
      return NextResponse.json(
        { error: 'User ID and OTP are required' },
        { status: 400 }
      );
    }

    const isValid = verifyOTP(userId, otp);
    console.log('OTP verification result for userId:', userId, 'isValid:', isValid);

    if (!isValid) {
      console.log('Invalid or expired OTP for userId:', userId);
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    await createSession(userId);
    console.log('Session created successfully for userId:', userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}