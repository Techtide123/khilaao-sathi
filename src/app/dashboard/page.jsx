'use client';
import { useRouter } from 'next/navigation';
import { FaUser, FaHome, FaBell, FaCog } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import FoodList from '@/components/dashhome/FoodList';

import Profile from '@/components/Myprofile/Profile';
import dynamic from 'next/dynamic';
import MyPostSlider from '@/components/dashhome/Mypost'
import Hero from '@/components/dashhome/Hero';

import { useAuth } from '@/lib/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import ProtectedRoute from '@/components/ProtectedRoute';
const MapClient = dynamic(() => import('@/components/dashhome/Map'), {
    ssr: false,
});
import usefoodStore from '@/store/foodStore';


export default function DashboardPage() {

    const [activeTab, setActiveTab] = useState('home');
    const [posts, setPosts] = useState([]);
    const { user, loading, logout } = useAuth();
    const [openWelcome, setOpenWelcome] = useState(false);
    const [userData, setUserData] = useState(null);

    const { data, isLoading } = usefoodStore();
    const router = useRouter();


    // fetch the user data
    // useEffect(() => {
    //     if (loading) return;

    //     if (!user) {
    //         toast.error("Login required!");
    //         router.push("/login");
    //         return;
    //     }

    //     const fetchUserData = async () => {
    //         try {
    //             const res = await fetch(`/api/cuserinfo/${user.uid}`, {
    //                 cache: "no-store",
    //             });
    //             if (!res.ok) throw new Error("Failed to fetch user");
    //             const data = await res.json();

    //             console.log("User data from the front rnd:", data.user.name);
    //             setUserData(data.user);

    //             const sessionKey = `welcomeShown_${user.uid}`;
    //             const hasShownWelcome = sessionStorage.getItem(sessionKey);

    //             if (!hasShownWelcome) {
    //                 setOpenWelcome(true);
    //                 sessionStorage.setItem(sessionKey, "true"); // ✅ Remember for this session
    //             }

    //         } catch (err) {
    //             console.error("Error fetching user data:", err);
    //         }
    //     };

    //     fetchUserData();
    // }, [loading, user]);



    // Fecthcing the Lat anf Long from the db
    // useEffect(() => {
    //     fetch('/api/getfood?filter=all')
    //         .then((res) => res.json())
    //         .then((data) => {
    //             if (Array.isArray(data.foods)) {
    //                 const validPosts = data.foods.filter(
    //                     (post) => post.lat !== undefined && post.lng !== undefined
    //                 );
    //                 setPosts(validPosts);
    //                 // Set filtered posts with valid lat/lng
    //                 // console.log("Valid posts with coordinates:", validPosts);
    //             } else {
    //                 console.error("Expected an array in data.foods but got:", data.foods);
    //             }
    //         })
    //         .catch((err) => console.error('Error fetching posts:', err));
    // }, []);



    useEffect(() => {
        if (Array.isArray(data)) {
            const validPosts = data.filter(
                (post) => post.lat !== undefined && post.lng !== undefined
            );
            setPosts(validPosts);
        }
    }, [data]);




    // useEffect(() => {
    //     if (!loading && !user) {
    //         toast.error("You must be logged in to view this page.");
    //         const timeout = setTimeout(() => {
    //             router.push("/login");
    //         }, 1500); // Give user time to read the toast

    //         return () => clearTimeout(timeout); // Clean up on unmount
    //     }
    // })


    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <>
                        {/* Hero section */}
                        <Hero />
                        {/* My Posts */}
                        <MyPostSlider />
                        {/* <Map /> */}
                        <MapClient posts={posts} />

                        {/* Food List */}
                        {/* <FoodList /> */}

                    </>
                );
            case 'profile':
                return (<>
                    {/* <Profile Info /> */}
                    <Profile />
                </>);
            case 'alerts':
                return <div><h2 className="text-xl font-bold">🔔 Alerts</h2></div>;
            case 'settings':
                return <div><h2 className="text-xl font-bold">⚙️ Settings</h2></div>;
            default:
                return null;
        }
    };


    return (
        <>

            {/* ✅ Minimal Welcome Popup */}
            {openWelcome && (
                <Dialog open onOpenChange={() => setOpenWelcome(false)}>
                    <DialogContent
                        className="max-w-md backdrop-blur-lg bg-white dark:bg-zinc-900/50 border border-white/10 shadow-2xl rounded-3xl p-8 text-center"
                    >
                        <DialogTitle className="text-3xl font-bold text-[#580fc2] drop-shadow-sm">
                            🎉 Welcome! <br />  <span className='text-black'>{userData.name}</span>
                        </DialogTitle>

                        <DialogDescription className="text-zinc-700 dark:text-zinc-300 mt-2 text-base">
                            We’re thrilled to have you here! Let's serve smiles, share meals, and spread kindness together. 💜
                        </DialogDescription>

                        <Button
                            onClick={() => setOpenWelcome(false)}
                            className="mt-6 bg-[#580fc2] hover:bg-[#6a1ee9] text-white w-full text-lg py-2 rounded-xl shadow-md transition-all"
                        >
                            Let’s Go 🚀
                        </Button>
                    </DialogContent>
                </Dialog>

            )}




            <div className="min-h-screen flex flex-col justify-between">


                {/* Main Content (Dynamic) */}
                <main className="flex-1 ">
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
            <ToastContainer position="top-center" />

        </>
    );
}
