'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupWithEmail, loginWithGoogle } from "@/lib/auth";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle } from "react-icons/fa";
import Image from "next/image";

export default function SignupPage() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // 1. Check if all fields are filled
        if (!form.name || !form.email || !form.password || !form.phone) {
            toast.error('Please fill all the fields');
            return;
        }

        setLoading(true);

        try {
            // 2. Try to create user
            await signupWithEmail(form.email, form.password);
            toast.success('Account created successfully!');
            // Redirect to dashboard or wherever
            router.push('/login');
        } catch (error) {
            // 3. If user already exists, show error and redirect to login
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already registered. Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                // Other errors
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };


const handleGoogleSignup = async () => {
  try {
    const result = await loginWithGoogle();
    const user = result.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    await new Promise((res) => setTimeout(res, 500));

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New user – save info
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString()
      });
      toast.success("Google signup successful!");
    } else {
      toast.info("Welcome back! Logging you in...");
    }

    router.push("/"); // Or redirect based on your app flow
  } catch (err) {
    toast.error("Google signup failed: " + err.message);
  }
};

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-white to-yellow-300 p-2">
            <div className="w-full max-w-md  backdrop-blur-md p-3  relative">
                <Image
                    src="/signup1.webp" // your logo path
                    alt="App Logo"
                    width={120}
                    height={120}
                        style={{ width: '60%', height: 'auto' , margin: 'auto' ,marginTop: '-20px'}}
                    priority
                    className=""
                />
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-700   tracking-tight">
                    SingUp Your Account
                </h1>
                <p className="text-gray-600 dark:text-gray-600 mb-8 text-sm " style={{ marginTop: '-3px', fontSize: '13px' }}>Welcome back to app</p>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="flex items-center bg-white border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
                        <FaUser className=" text-yellow-300  mr-3" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full outline-none bg-transparent placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center bg-white border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
                        <FaEnvelope className=" text-yellow-300  mr-3" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full outline-none bg-transparent placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center bg-white border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
                        <FaLock className=" text-yellow-300  mr-3" />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full outline-none bg-transparent placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center bg-white border rounded-xl px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-green-400">
                        <FaPhone className=" text-yellow-300  mr-3" />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full outline-none bg-transparent placeholder-gray-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r  from-yellow-400 to-yellow-500 hover:from-green-500 hover:to-green-700 text-white text-lg font-semibold py-2 rounded-xl shadow-lg transition-all duration-300"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="my-6 text-center text-sm text-gray-500">— or continue with —</div>

<button
  onClick={handleGoogleSignup}
  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 
    text-gray-800 font-medium py-3 rounded-xl shadow-md transition-all duration-300"
>
  <FaGoogle className="text-red-500 text-xl" />
  Continue with Google
</button>

            </div>

            <ToastContainer position="top-center" />
        </div>
    );
}
