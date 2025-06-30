"use client";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullScreenLoader from "@/components/ui/FullScreenLoader";


export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            const timeout = setTimeout(() => {
                router.push("/login?unauthorized=true");
            }, 1500); // Give user time to read the toast

            return () => clearTimeout(timeout); // Clean up on unmount
        }
    }, [user, loading,router]);

    if (loading || !user) {
        return <FullScreenLoader />;
    }

    return children;
}
