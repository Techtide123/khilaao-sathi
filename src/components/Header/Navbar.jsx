import React from 'react'
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/lib/authContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user]);
    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully!");
        router.push('/login');
    };
    return (
        <>
            <header className="flex justify-between items-center px-4 py-3 bg-white shadow-md border-b border-gray-100 rounded-b-xl sticky top-0 z-50">
                <div className="flex flex-col text-sm text-gray-800 leading-tight">
                    <span className="text-xs text-gray-500">Hey There 👋</span>
                    <span className="text-[13px] font-semibold text-[#b6985a] truncate max-w-[8rem]">
                        {user?.displayName || user?.email}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <div className="w-10 h-10 rounded-full shadow-md border-2 border-[#b6985a] overflow-hidden">
                            <Link href="/dashboard">
                            <img
                                src={user.photoURL || "/user.png"}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full shadow hover:shadow-lg transition-all duration-300 bg-[#fef9f3] border border-[#b6985a] text-[#b6985a] hover:bg-[#fff4dc]"
                        title="Logout"
                    >
                        <FiLogOut size={18} />
                    </button>
                </div>
            </header>

        </>
    )
}

export default Navbar