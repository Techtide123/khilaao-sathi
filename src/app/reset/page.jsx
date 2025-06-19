'use client';
import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
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
        <div className="container mx-auto px-4 py-32 md:px-6 md:py-16 overflow-hidden bg-gradient-to-b from-[#ede9fe] via-white to-[#f8fafc] ">
            <Card className="mx-auto max-w-md">
                <CardHeader className="space-y-1">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <LockIcon className="text-primary h-6 w-6" />
                    </div>
                    <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Create a new password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                        <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <AlertDescription>
                                Your password has been successfully reset. You can now{" "}
                                <Link href="#" className="font-medium underline">
                                    sign in
                                </Link>{" "}
                                with your new credentials.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Your E-Mail</label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="shi@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <Button type="submit" className="w-full">
                                Send Reset Link
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-muted-foreground text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="text-[#580FC2] underline ">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            <ToastContainer position="top-center" />
        </div>
    );

}
