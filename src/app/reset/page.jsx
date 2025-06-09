'use client';
import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const handleReset = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        try {
            await resetPassword(email);
            toast.success("Reset link sent! Check your email.");
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                toast.error("No account found with this email.");
            } else {
                toast.error("Error: " + error.message);
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/loginbg.webp')" }}
        >
            <div className="max-w-md w-full mx-auto p-6">
                <Image
                    src="/reset.png" // your logo path
                    alt="App Logo"
                    width={120}
                    height={120}
                    style={{ width: '30%', height: 'auto', margin: 'auto', marginTop: '-20px' }}
                    priority
                />
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-700   tracking-tight mt-4">
                    Reset Password
                </h1>
                <p className="text-gray-600 dark:text-gray-600 mb-8 text-sm " style={{ marginTop: '-3px', fontSize: '13px' }}>Forgot your password? Don't worry, we'll help you reset it.</p>
                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-2/3 mx-auto flex items-center justify-center gap-3  from-yellow-400 to-yellow-500 bg-gradient-to-br text-white font-semibold py-2 rounded-4xl transition"
                    >
                        Send Reset Link
                    </button>
                    <div className="my-3 text-center text-sm text-gray-500">— or continue with —</div>
                    
                    
                </form>
                <div className="flex flex-row gap-3">
                    <button
                      className=" flex items-center justify-center gap-3
                        text-white font-medium py-1 rounded-xl shadow-md transition-all duration-300 w-xl bg-amber-300"
                        onClick={() => router.push("/login")}
                    >
                      Login
                    </button>
                    <button
                      className=" flex items-center justify-center gap-3
                        text-amber-300 font-medium py-1 rounded-xl shadow-md transition-all duration-300 w-xl border-amber-300"
                        onClick={() => router.push("/signup")}
                    >
                      Sign Up
                    </button>
                    </div>
                <ToastContainer position="top-center" />
            </div>
        </div>
    );
}
