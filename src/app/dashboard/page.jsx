'use client';
import { useRouter } from 'next/navigation';
import { FaUser, FaHome, FaBell, FaCog } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import FoodList from '@/components/dashhome/FoodList';
import Navbar from '@/components/Header/Navbar';
import Profile from '@/components/Myprofile/Profile';
import dynamic from 'next/dynamic';




const MapClient = dynamic(() => import('@/components/dashhome/Map'), {
    ssr: false,
});



export default function DashboardPage() {

    const [activeTab, setActiveTab] = useState('home');
    const [posts, setPosts] = useState([]);

    const router = useRouter();


    // Fecthcing the Lat anf Long from the db
    useEffect(() => {
        fetch('/api/getfood?filter=all')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.foods)) {
                    const validPosts = data.foods.filter(
                        (post) => post.lat !== undefined && post.lng !== undefined
                    );
                    setPosts(validPosts); // Set filtered posts with valid lat/lng
                    console.log("Valid posts with coordinates:", validPosts);
                } else {
                    console.error("Expected an array in data.foods but got:", data.foods);
                }
            })
            .catch((err) => console.error('Error fetching posts:', err));
    }, []);



    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <>
                        {/* <Map /> */}
                        <MapClient posts={posts} />

                        {/* Food List */}
                        <FoodList />
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
        <div className="min-h-screen flex flex-col justify-between">
            {/* Header */}
            <Navbar />

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
