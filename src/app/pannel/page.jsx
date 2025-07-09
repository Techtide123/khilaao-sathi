'use client'

import { useEffect, useState } from 'react'
import { Home, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Phone, CalendarDays, Clock, BarChart, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import TestChart from '@/app/charts/page'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute';
// import stores
import useUserStore from '@/store/userStore'

// get auth from firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function DashboardPanel() {
    const [tab, setTab] = useState('home')
    const [darkMode, setDarkMode] = useState(false)
    const [userUid, setUserUid] = useState()
    const [currentUserinfo, setCurrentUserinfo] = useState()
    const [userMetaData, setUserMetaData] = useState()
    const [openProfileModal, setOpenProfileModal] = useState(false)
    const { logout } = useAuth();
    const { users, fetchUsers, isLoading } = useUserStore()
    const router = useRouter();

    useEffect(() => {
        if (!users) {
            fetchUsers()
        }
    }, [users, fetchUsers])

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid)
                setUserMetaData(user.metadata)
                console.log("✅ User is logged in:", user)
            } else {
                console.warn("⚠️ No user is logged in")
            }
        })

        // Optional: log users if available (on every update of `users`)
        if (users) {
            console.log("👥 Users data:", users)
        }

        return () => unsubscribe() // cleanup listener on unmount
    }, [users])



    useEffect(() => {
        if (userUid && users) {
            const findUser = users.filter(item => item.uid === userUid)
            setCurrentUserinfo(findUser)

        }
    }, [userUid, users])



    // Update Information function 
    const updateInfo = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/cuserinfo/${userUid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: e.target.name.value,
                    phone: e.target.phone.value,
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error("Update failed");

            setCurrentUserinfo([result.user]);

            setOpenProfileModal(false);
            toast.success(" Profile updated successfully!");
        } catch (err) {
            toast.error(" Update failed: " + err.message);
        }
    };




    // Log out function
    const handleLogout = async () => {
        try {
            await logout(); // Firebase signOut
            toast.success("Logged out successfully!");

            // Navigate first, then reload after a short delay
            router.push('/login');

            setTimeout(() => {
                window.location.reload(); // Hard refresh
            }, 500); // Enough time for router.push to complete
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    };


    // Log out function
    return (
        <>
            <ProtectedRoute>
                <div className={`flex ${darkMode ? 'dark' : ''} h-screen overflow-hidden`}>
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 p-4 hidden md:flex flex-col">

                        <Link href="/dashboard">
                            <button
                                className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white rounded-full shadow hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 mb-6"
                                aria-label="Back to Home"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        </Link>


                        <nav className="flex flex-col gap-3">
                            <Button
                                variant={tab === 'home' ? 'default' : 'ghost'}
                                className={`justify-start text-left gap-3 
    ${tab !== 'home' ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`}
                                onClick={() => setTab('home')}
                            >
                                <Home size={18} /> Home
                            </Button>

                            <Button
                                variant={tab === 'profile' ? 'default' : 'ghost'}
                                className={`justify-start text-left gap-3 
    ${tab !== 'profile' ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`}
                                onClick={() => setTab('profile')}
                            >
                                <User size={18} /> Profile
                            </Button>

                            <Button
                                variant={tab === 'reports' ? 'default' : 'ghost'}
                                className={`justify-start text-left gap-3 
    ${tab !== 'reports' ? 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800' : ''}`}
                                onClick={() => setTab('reports')}
                            >
                                <BarChart size={18} /> Reports
                            </Button>

                        </nav>

                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col h-full">
                        {/* Sticky Topbar */}
                        <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700 shadow-sm px-6 py-3 flex justify-between items-center">
                            {/* Left: Greeting + Menu */}
                            <div className="flex items-center gap-4">
                                <Menu className="md:hidden h-6 w-6 text-zinc-700 dark:text-zinc-300" />

                                <div className="flex items-center gap-3">
                                    {/* Greeting Icon */}
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-zinc-700 dark:to-zinc-800 shadow-inner">
                                        <span className="text-xl md:text-2xl">👋</span>
                                    </div>

                                    {/* Welcome Text */}
                                    <div className="flex flex-col justify-center leading-tight">
                                        <h1 className="text-base md:text-lg font-semibold text-zinc-800 dark:text-white">
                                            Welcome, {currentUserinfo?.[0]?.name || 'Guest'}
                                        </h1>
                                        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                                            Have a productive day!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Dark Mode Switch + Avatar */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hidden sm:block">
                                    Dark Mode
                                </span>
                                <Switch checked={darkMode} onCheckedChange={setDarkMode} />

                                <Avatar className="h-9 w-9 ring-2 ring-zinc-300 dark:ring-zinc-700">
                                    <AvatarFallback className="text-sm">
                                        {currentUserinfo?.[0]?.name?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </header>


                        {/* Tab Content */}
                        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50 dark:bg-zinc-950">
                            {tab === 'home' && (
                                <>

                                    {/* Stats Section */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {/* Posts Created */}
                                        <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-md border border-blue-300 dark:border-zinc-700">
                                            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Posts Created</h3>
                                            <p className="text-4xl font-bold text-zinc-900 dark:text-white">33</p>
                                        </div>

                                        {/* Posts Claimed */}
                                        <div className="p-6 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-md border border-pink-300 dark:border-zinc-700">
                                            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Posts Claimed</h3>
                                            <p className="text-4xl font-bold text-zinc-900 dark:text-white">12</p>
                                        </div>

                                        {/* Inspirational Message */}
                                        <div className="p-6 bg-gradient-to-r from-emerald-100 to-green-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-md border border-green-300 dark:border-zinc-700">
                                            <p className="text-sm text-zinc-700 dark:text-zinc-200 italic">
                                                “The best way to find yourself is to lose yourself in the service of others.” – Gandhi
                                            </p>
                                        </div>
                                    </div>
                                    <TestChart />

                                </>
                            )}

                            {tab === 'profile' && (
                                <section className="space-y-6 px-2 md:px-0">
                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-indigo-500 dark:border-indigo-300">
                                            <Image
                                                src={currentUserinfo?.[0]?.profileImage || '/default-avatar.png'}
                                                alt="Profile Image"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{currentUserinfo?.[0]?.name}</h2>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{currentUserinfo?.[0]?.email}</p>
                                        </div>
                                    </div>

                                    {/* Info Grid */}


                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        {/* Phone */}
                                        <div className="rounded-xl bg-white dark:bg-zinc-800 p-4 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-start gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
                                                <p className="text-base font-semibold text-zinc-900 dark:text-white mt-1">
                                                    {currentUserinfo?.[0]?.phone}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Joined Date */}
                                        <div className="rounded-xl bg-white dark:bg-zinc-800 p-4 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-start gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg">
                                                <CalendarDays className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Joined</p>
                                                <p className="text-base font-semibold text-zinc-900 dark:text-white mt-1">
                                                    {new Date(userMetaData?.creationTime).toLocaleDateString() || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Last Sign-In */}
                                        <div className="rounded-xl bg-white dark:bg-zinc-800 p-4 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-start gap-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Last Sign In</p>
                                                <p className="text-base font-semibold text-zinc-900 dark:text-white mt-1">
                                                    {new Date(userMetaData?.lastSignInTime).toLocaleDateString() || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                                        {/* 📝 Update Profile Dialog */}
                                        <Dialog open={openProfileModal} onOpenChange={setOpenProfileModal}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full sm:w-auto px-5 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                                                >
                                                    ✏️ Update Info
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Update Profile</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes to your profile here. Click save when you're done.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <form onSubmit={updateInfo} className="space-y-4 pt-2">
                                                    <div>
                                                        <Label htmlFor="name">Name</Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            defaultValue={currentUserinfo?.[0]?.name}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="phone">Phone</Label>
                                                        <Input
                                                            id="phone"
                                                            name="phone"
                                                            defaultValue={currentUserinfo?.[0]?.phone}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="text-right">
                                                        <Button type="submit" className="px-4 py-2 text-sm">
                                                            💾 Save
                                                        </Button>
                                                    </div>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        {/* 🚪 Logout Button */}
                                        <Button
                                            variant="destructive"
                                            className="w-full sm:w-auto px-5 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                                            onClick={handleLogout}
                                        >
                                            🚪 Logout
                                        </Button>

                                        {/* Toast notifications */}
                                        <ToastContainer position="top-right" autoClose={2000} />
                                    </div>


                                </section>




                            )}

                            {tab === 'reports' && (
                                <>
                                    <TestChart />
                                </>
                            )}
                        </main>

                    </div>

                </div>
            </ProtectedRoute>
        </>
    )
}
