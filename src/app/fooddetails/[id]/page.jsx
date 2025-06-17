'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { PiCheckCircleBold } from 'react-icons/pi';
import Navbar from '@/components/Header/Navbar';
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RouteMap = dynamic(() => import('@/components/FoodDetails/RouteMap'), {
  ssr: false
});


// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default function FoodDetailsPage() {

  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const [claimerName, setClaimerName] = useState("");


  useEffect(() => {
    async function fetchFood() {
      const res = await fetch(`/api/fooddetails/${id}`);
      const data = await res.json();
      setFood(data.food);
      console.log(data.food);
    }

    fetchFood();
  }, [id]);

  useEffect(() => {
    async function reverseGeocode(lat, lng) {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=8b4c9aa846884b49b26cf5a36ba0496c`
        );
        const result = await response.json();
        const location = result?.results?.[0]?.components;

        // Prefer suburb/locality or fallback to city/state
        const place = location?.suburb || location?.neighbourhood || location?.village || location?.city || location?.state || "Unknown Location";
        setLocationName(place);
      } catch (err) {
        console.error("Reverse geocoding failed", err);
        setLocationName("Unknown Location");
      }
    }

    if (food?.lat && food?.lng) {
      reverseGeocode(food.lat, food.lng);
    }
  }, [food]);

  useEffect(() => {
    if (food?.status === 'claimed' && food?.claimedBy) {
      setShowClaimedPopup(true);


      // Fetch claimer name from backend
      const fetchClaimerName = async () => {
        try {
          const res = await fetch(`/api/cuserinfo/${food.claimedBy}`);
          const data = await res.json();

          if (res.ok) {
            setClaimerName(data.user.name || "Anonymous");
          } else {
            setClaimerName("Unknown User");
          }
        } catch (error) {
          console.error("Error fetching claimer name:", error);
          setClaimerName("Unknown User");
        }
      };

      fetchClaimerName();
    }
  }, [food]);




  if (food && !food.images) {
    food.images = [
      "https://res.cloudinary.com/demo/image/upload/v1695062396/sample.jpg",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
    ];
  }


  if (!food) return <p className="text-center mt-10 text-gray-500">Loading...</p>;



  // claim Food Status function
  const handleClaimFood = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to claim food.");
      return;
    }

    // Prevent poster from claiming their own food
    if (user.uid === food.uid) {
      toast.warning("You cannot claim your own food post.");
      // alert(food.uid +" :: " + user.uid);
      return;
    }

    if (food.status === 'active') {
      const confirmClaim = window.confirm("Are you sure you want to claim this food?");
      if (!confirmClaim) return;

      // ✅ Get current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const claimerLat = position.coords.latitude;
        const claimerLng = position.coords.longitude;

        try {
          const res = await fetch('/api/claimfood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              foodId: food._id,
              uid: user.uid,
              claimerLat,
              claimerLng
            })
          });

          const data = await res.json();
          toast.success(data.message);


          // Optional: refresh
          location.reload();
          // Here is the After Claiming the food 


        } catch (err) {
          console.error(err);
          toast.error("Something went wrong while claiming.");
        }
      }, (error) => {
        console.error(error);
        toast.error("Failed to get your location. Please allow GPS permission.");
      });

    } else {
      // Status not active
      let msg = '';
      if (food.status === 'claimed') msg = "This food has already been claimed.";
      else if (food.status === 'expired') msg = "This food post has expired.";
      else msg = `This food is currently marked as: ${food.status}`;

      toast.info(msg);

    }
  };





  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-4 space-y-6 text-[#333] font-sans">

        {/* Image Slider */}
        <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-yellow-200">
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="w-full h-56"
          >
            {(food.images || []).map((imgUrl, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={imgUrl}
                  alt={`Food Image ${idx}`}
                  className="w-full h-56 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Title & Description */}
        <div className="space-y-1 px-2">
          <h1 className="text-3xl font-serif text-[#b6985a] tracking-wide">{food.title}</h1>
          <p className="text-gray-700 text-sm leading-relaxed">{food.description}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 px-2 text-sm text-gray-700">
          <FaMapMarkerAlt className="text-[#b6985a] text-lg shadow-sm" />
          <span className="font-medium">{locationName}</span>
          <a
            href={`https://www.google.com/maps?q=${food.lat},${food.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[#b6985a] underline font-semibold"
          >
            View on Map
          </a>
        </div>

        {/* Info Cards */}
        <div className="bg-[#fffdf4] p-4 rounded-xl shadow-md space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MdAccessTime className="text-[#b6985a] text-lg" />
            <span>Posted: {new Date(food.postedAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <PiCheckCircleBold className="text-green-600 text-lg" />
            <span>
              Status: <span className="capitalize font-semibold">{food.status}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">People Served:</span>
            <span>{food.peopleCount}</span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${food.contact}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 transition-all"
        >
          <FaWhatsapp className="inline-block mr-2 text-lg" />
          Chat on WhatsApp
        </a>


        {/* Show Popup if current user claimed */}
        {showClaimedPopup && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Blurred Overlay on Bottom Half */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Popup Content */}
            <div className="relative w-full max-w-md bg-white rounded-t-2xl shadow-2xl p-6 animate-slide-up z-10">
              {/* Close Button */}
              <button
                onClick={() => setShowClaimedPopup(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

              <div className="text-center space-y-4 mt-6">
                <h2 className="text-2xl font-semibold text-green-600">🎉 Claimed Successfully!</h2>
                <p className="text-gray-700">
                  You have successfully claimed this food item. Please collect it soon.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Claimed by: <span className="font-medium text-gray-800">{claimerName}</span>
                </p>
                <RouteMap
                  senderLat={food.lat}
                  senderLng={food.lng}
                  claimerLat={food.claimerLat}
                  claimerLng={food.claimerLng}
                />
                <button
                  onClick={() => setShowClaimedPopup(false)}
                  className="mt-4 px-5 py-2 bg-[#b6985a] text-white rounded-full shadow hover:brightness-110 transition"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}













        <button
          className={`block w-full text-center py-3 rounded-xl font-semibold shadow-lg transition-all
           ${food.status === 'active' ? 'bg-[#b6985a] text-white hover:brightness-110' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          onClick={handleClaimFood}
        >
          {food.status === 'active' ? 'Claim Now' : food.status.charAt(0).toUpperCase() + food.status.slice(1)}
        </button>
        <ToastContainer position="top-center" />
      </div>
    </>
  );
}


