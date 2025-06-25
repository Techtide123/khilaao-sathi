'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupWithEmail, loginWithGoogle } from "@/lib/auth";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        image: null,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.phone || !form.image) {
            toast.error('Please fill all the fields');
            return;
        }

        setLoading(true);

        try {
            const otpRes = await fetch('/api/sendotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email }),
            });

            const otpData = await otpRes.json();
            if (!otpRes.ok) throw new Error(otpData.message || 'Failed to send OTP');

            toast.success("OTP sent to email");
            setShowOtpInput(true);
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    const verifyOtpWithBackend = async (enteredOtp) => {
        try {
            const verifyRes = await fetch('/api/verifyotp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, otp: enteredOtp }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || 'Invalid OTP');

            toast.success("OTP Verified!");
            await completeSignup(); // proceed to account creation
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    const completeSignup = async () => {
        try {
            const userCredential = await signupWithEmail(form.email, form.password);
            const user = userCredential.user;

            const formData = new FormData();
            formData.append('uid', user.uid);
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('phone', form.phone);
            formData.append('image', form.image);

            const res = await fetch('/api/signup', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to store user data');

            toast.success('Account created successfully!');
            router.push('/login');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error('Email already registered. Redirecting to login...');
                setTimeout(() => router.push('/login'), 3000);
            } else {
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

            const userRef = doc(db, "users", user.uid);
            await new Promise((res) => setTimeout(res, 500));
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
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

            router.push("/");
        } catch (err) {
            toast.error("Google signup failed: " + err.message);
        }
    };

    return (
        <>
            <div className="flex w-full items-center justify-center p-3 md:p-4 min-h-[95vh] bg-gradient-to-b from-[#ede9fe] via-white to-[#f8fafc]">
                <div className="w-full max-w-5xl">
                    <Card className="overflow-hidden mb-3">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form className="p-6 md:p-8" onSubmit={handleSignup}>
                                <div className="flex flex-col gap-6">
                                    <div className="text-center">
                                        <h1 className="text-2xl md:text-3xl font-bold text-[#580FC2]">Create Your Account</h1>
                                    </div>

                                    <InputGroup label="Full Name" id="name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Shitansu Kumar Gochhayat" />
                                    <InputGroup label="Email" id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="m@example.com" />
                                    <InputGroup label="Password" id="password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="******" />
                                    <InputGroup label="Phone Number" id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 1234567890" />

                                    <div className="grid gap-3">
                                        <Label htmlFor="image">Profile Image</Label>
                                        <Input id="image" type="file" name="image" accept="image/*" onChange={handleImageChange} required />
                                    </div>

                                    <Button type="submit" className="w-full bg-[#580FC2] hover:bg-[#4c0aae] text-white" disabled={loading}>
                                        {loading ? "Processing..." : "Create Account"}
                                    </Button>

                                    <div className="text-center text-sm relative after:border-t after:inset-0 after:top-1/2 after:absolute">
                                        <span className="bg-white px-2 relative z-10 text-muted-foreground">Or continue with</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <OAuthButton icon="apple" />
                                        <OAuthButton icon="google" onClick={handleGoogleSignup} />
                                        <OAuthButton icon="meta" />
                                    </div>

                                    <div className="text-center text-sm">
                                        Already have an account?{" "}
                                        <Link href="/login" className="underline text-[#580FC2]">Login</Link>
                                    </div>
                                </div>
                            </form>

                            <div className="bg-muted relative hidden md:block">
                                <Image src="/si.avif" alt="Image" fill quality={100} priority className="object-cover absolute inset-0" />
                            </div>
                        </CardContent>
                    </Card>

                    {showOtpInput && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl px-8 py-10 border border-white/30">

                                {/* Close Button */}
                                <button
                                    onClick={() => setShowOtpInput(false)}
                                    className="absolute top-4 right-5 text-gray-400 hover:text-[#580FC2] text-2xl font-bold transition bg-gray-300 rounded-full w-7 h-7 flex items-center justify-center"
                                    aria-label="Close"
                                >
                                    ×
                                </button>

                                {/* Heading */}
                                <h2 className="text-2xl font-bold text-center text-[#580FC2] mb-2">
                                    Verify Email
                                </h2>
                                <p className="text-sm text-center text-gray-600 mb-6">
                                    Enter the 6-digit OTP sent to:
                                    <br />
                                    <span className="font-medium text-black">{form.email}</span>
                                </p>

                                {/* OTP Input Fields */}
                                <div className="flex justify-center mb-6">
                                    <InputOTP maxLength={6} onChange={(otp) => {
                                        setOtpInput(otp);
                                        if (otp.length === 6) verifyOtpWithBackend(otp);
                                    }}>
                                        <InputOTPGroup className="flex gap-3">
                                            {[...Array(6)].map((_, i) => (
                                                <InputOTPSlot
                                                    key={i}
                                                    index={i}
                                                    className=" w-8 h-8 md:w-12 md:h-14 md:text-2xl md:rounded-lg border border-gray-300 shadow-md bg-white text-center focus:ring-2 focus:ring-[#580FC2] focus:border-[#580FC2] transition-all"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                {/* Cancel Button */}
                                <Button
                                    variant="ghost"
                                    className="w-full text-sm text-gray-500 hover:text-[#580FC2] transition font-medium"
                                    onClick={() => setShowOtpInput(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}





                    <ToastContainer position="top-center" />
                </div>
            </div>
        </>
    );
}

// 🔹 Reusable input field group
function InputGroup({ label, id, type, name, value, onChange, placeholder }) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required />
        </div>
    );
}

// 🔹 OAuth buttons (you can replace icons if needed)
function OAuthButton({ icon, onClick }) {
    const icons = {
        apple: `<svg ... />`,
        google: `<svg ... />`,
        meta: `<svg ... />`
    };

    return (
        <Button variant="outline" type="button" onClick={onClick} className="w-full border-[#580FC2] text-[#580FC2] hover:bg-[#580FC2]/10">
            <span className="sr-only">Sign up with {icon}</span>
            {/* You can replace these placeholders with actual icons */}
            <span className="text-xl">{icon[0].toUpperCase()}</span>
        </Button>
    );
}
