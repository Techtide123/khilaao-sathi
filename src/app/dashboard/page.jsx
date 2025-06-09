'use client';
import { useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi';
import { FaUser, FaHome, FaBell, FaCog } from 'react-icons/fa';
import { useState } from 'react';
import Map from '@/components/dashhome/Map';

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');

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


    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (<Map />);
            case 'profile':
                return <div><h2 className="text-xl font-bold">👤 Profile Content</h2></div>;
            case 'alerts':
                return <div><h2 className="text-xl font-bold">🔔 Alerts</h2></div>;
            case 'settings':
                return <div><h2 className="text-xl font-bold">⚙️ Settings</h2></div>;
            default:
                return null;
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen flex flex-col justify-between">
            {/* Header */}
            <header className="flex justify-between items-center px-4 py-3 bg-white shadow-md border-b border-gray-100 rounded-b-xl">
                <div className="flex flex-col text-sm text-gray-800 leading-tight">
                    <span className="text-xs text-gray-500">Hey There 👋</span>
                    <span className="text-[13px] font-semibold text-[#b6985a] truncate max-w-[8rem]">
                        {user?.displayName || user?.email}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <div className="w-10 h-10 rounded-full shadow-md border-2 border-[#b6985a] overflow-hidden">
                            <img
                                src={user.photoURL || "/user.png"}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
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

            {/* Main Content (Dynamic) */}
            <main className="flex-1 p-4">
                {renderTabContent()}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-50">
                <div className="flex justify-around py-3 text-sm text-gray-700">
                    <button onClick={() => setActiveTab('home')} className="flex flex-col items-center">
                        <FaHome size={20} />
                        <span className="text-xs">Home</span>
                    </button>
                    <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center">
                        <FaUser size={20} />
                        <span className="text-xs">Profile</span>
                    </button>
                    <button onClick={() => setActiveTab('alerts')} className="flex flex-col items-center">
                        <FaBell size={20} />
                        <span className="text-xs">Alerts</span>
                    </button>
                    <button onClick={() => setActiveTab('settings')} className="flex flex-col items-center">
                        <FaCog size={20} />
                        <span className="text-xs">Settings</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
