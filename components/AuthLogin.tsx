"use client"
import React, { useState, useEffect, useRef } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface AuthLoginProps {
  className?: string;
  callbackUrl?: string;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ className = "", callbackUrl = "/" }) => {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (userId) {
      inputRefs.current[0]?.focus();
    }
  }, [userId]);

  useEffect(() => {
    if (session?.user) {
      console.log('Logged in user details:', {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        session: session
      });
    }
  }, [session]);

  const handleSendOtp = async () => {
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Use the email from state
      });

      const data = await response.json();
      if (response.ok) {
        setUserId(data.userId);
        console.log('OTP sent to your email');
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("verify-otp", {
        email,
        otp,
        userId,
        redirect: false,
      });

      if (result?.error) {
        console.log("Invalid OTP");
      }
    } catch (error) {
      console.log("An error occurred");
    } finally {
    }
  };

  if (session) {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <p>Signed in as {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="px-4 py-2 border rounded-lg"
      />
      <button
        onClick={handleSendOtp}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Send OTP
      </button>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="px-4 py-2 border rounded-lg"
      />
      <button
        onClick={handleOtpSubmit}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Verify OTP
      </button>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-gray-800 rounded-lg border hover:bg-gray-50 transition-colors"
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>

      <button
        onClick={() => signIn("github", { callbackUrl })}
        className="flex items-center justify-center gap-2 px-6 py-2 bg-[#24292e] text-white rounded-lg hover:bg-[#2c3238] transition-colors"
      >
        <FaGithub className="text-xl" />
        Sign in with GitHub
      </button>

      <button
        onClick={() => signIn("linkedin", { callbackUrl })}
        className="flex items-center justify-center gap-2 px-6 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006396] transition-colors"
      >
        <FaLinkedin className="text-xl" />
        Sign in with LinkedIn
      </button>
    </div>
  );
};

export default AuthLogin;