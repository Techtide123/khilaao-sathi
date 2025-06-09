'use client';

import { useState } from "react";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    try {
      await loginWithEmail(email, password);
      toast.success('Login successful!');
      router.push("/dashboard");
    } catch (err) {
      // Firebase auth error codes
      switch (err.code) {
        case 'auth/user-not-found':
          toast.error('User not found. Please sign up first.');
          break;
        case 'auth/wrong-password':
          toast.error('Invalid credentials. Please check your password.');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email format.');
          break;
        default:
          toast.error('Login failed: ' + err.message);
      }
    }
  };

   const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      router.push("/"); // ✅ redirect after success
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        toast.info("Google sign-in cancelled.");
      } else if (err.code === "auth/cancelled-popup-request") {
        toast.warning("Multiple sign-in attempts. Please try again.");
      } else {
        toast.error("Login failed: " + err.message);
      }
    }
  };

  return (
    <div className="mx-auto  bg-white  pl-8 pr-8 pb-1
      sm:p-10
      " style={{backgroundImage: 'url(/loginbg.webp)', backgroundSize: 'cover'}} >
        <Image
          src="/login.webp" // your logo path
          alt="App Logo"
          width={120}
          height={120}
          style={{ width: '90%', height: 'auto' , margin: 'auto' ,marginTop: '-20px'}}
          priority
          className=""
        />
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-700   tracking-tight">
        Login Account
      </h1>
      <p className="text-gray-600 dark:text-gray-600 mb-8 text-sm " style={{ marginTop: '-3px', fontSize: '13px' }}>Welcome back to app</p>

      <form onSubmit={handleLogin} className="space-y-6">

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm  text-gray-700 mb-1 font-semibold">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md border border-gray-600 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm  text-gray-700 mb-1 font-semibold">
            Password          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border border-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-black
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
        </div>
        <div className="mb-4 ">
          <Link href="/reset" rel="noopener noreferrer">
          <label htmlFor="email" className="block text-sm  text-gray-700 mb-1 font-semibold" style={{ fontSize: '12px', color: 'gray', textAlign: 'right', marginTop: '-10px' }}>
            Forgot Password?
          </label>
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-blue-700 hover:to-blue-600
            text-white font-semibold py-2 rounded-md shadow-md transition duration-300"
        >
          Login
        </button>
      </form>

      <div className=" flex items-center justify-center space-x-3">
        <span className="text-gray-400 dark:text-gray-500">or</span>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="mt-6 w-full flex items-center justify-center space-x-3 border border-red-500
          text-red-600 font-semibold py-2 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 transition"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 533.5 544.3"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#4285f4"
            d="M533.5 278.4c0-17.6-1.5-34.5-4.3-50.9H272v96.4h147.3c-6.3 34-25 62.8-53.5 82.3v68.3h86.3c50.4-46.5 79.4-114.7 79.4-196.1z"
          />
          <path
            fill="#34a853"
            d="M272 544.3c72.9 0 134-24.1 178.7-65.4l-86.3-68.3c-24 16.1-54.7 25.6-92.4 25.6-70.9 0-131-47.8-152.4-112.2H34.9v70.5c44.3 87.3 135.3 149.8 237.1 149.8z"
          />
          <path
            fill="#fbbc04"
            d="M119.6 321.9c-10.8-32-10.8-66.8 0-98.7v-70.5H34.9c-39.7 78.7-39.7 172.5 0 251.2l84.7-82z"
          />
          <path
            fill="#ea4335"
            d="M272 107.7c39.7-.6 77.9 14.3 106.8 41.3l80-80C405.6 24.1 344.5 0 272 0 170.1 0 79.1 62.5 34.9 149.8l84.7 70.5c21.4-64.4 81.5-112.6 152.4-112.6z"
          />
        </svg>
        <span>Login with Google</span>
      </button>
              <div className="mb-4 ">
          <label htmlFor="email" className="block text-sm  text-gray-700 mb-1 font-semibold" style={{ fontSize: '12px', color: 'gray', textAlign: 'center', marginTop: '20px' }}>
Not register yet?  <Link href="/signup" className="text-gray-900 hover:underline">Creat Account</Link>
          </label>
        </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
