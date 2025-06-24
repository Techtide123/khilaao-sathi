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
import { Footer } from '@/components/Footer/Footer';
import { Button } from '@/components/ui/button';
import { Star, Truck, ShieldCheck, Heart, Landmark, UserCheck, User, Clock, Users, X, LoaderIcon } from "lucide-react";
import FullScreenLoader from '@/components/ui/FullScreenLoader'


export default function FoodDetailsPage() {

  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const [claimerName, setClaimerName] = useState("");
  const [posterName, setPosterName] = useState("");


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

  useEffect(() => {
    if (food?.uid) {
      const fetchPosterName = async () => {
        try {
          const res = await fetch(`/api/cuserinfo/${food.uid}`);
          const data = await res.json();
          console.log("Poster data:", data.user.name);

          if (res.ok) {
            setPosterName(data.user.name || "Anonymous");
          } else {
            setPosterName("Unknown User");
          }
        } catch (error) {
          console.error("Error fetching poster name:", error);
          setPosterName("Unknown User");
        }
      };

      fetchPosterName();
    }
  }, [food]);










  if (food && !food.images) {
    food.images = [
      "https://res.cloudinary.com/demo/image/upload/v1695062396/sample.jpg",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
    ];
  }


  if (!food) {
    return (
   <FullScreenLoader />
    );
  }



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
    <div className="flex flex-col min-h-screen 
  bg-gradient-to-b from-gray-100 to-gray-200 
  dark:from-zinc-900 dark:to-zinc-800"
    >
      <Navbar />
      {/* new Ui */}

      <div className="w-full max-w-5xl mx-auto p-6 mt-26 mb-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md text-foreground">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Swiper
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="w-full h-full"
            >
              {(food.images || []).map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={imgUrl}
                    alt={`Food Image ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-4 right-4">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Status Tag */}
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
        ${food.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}
              >
                {food.status.charAt(0).toUpperCase() + food.status.slice(1)}
              </span>
            </div>

            {/* Title */}
            <h1 className=" text-2xl md:text-3xl font-bold mb-2 text-foreground">{food.title}</h1>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{food.description}</p>

            {/* Location Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${food.lat},${food.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
                >
                  <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
                  <span>View on Map</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Landmark className="h-4 w-4 text-muted-foreground" />
                <span>{locationName}</span>
              </div>
            </div>

            {/* Time and People Info */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-foreground">Select Size</span>
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted: {new Date(food.postedAt).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>People Count: {food.peopleCount}</span>
                </div>
              </div>
            </div>

            {/* Claimed & Poster Info */}

            <div className="flex  flex-col md:flex-row gap-4   md:gap-12 bg-muted/10 p-4 rounded-xl border mt-6">
              {food.status === 'claimed' && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">Claimed By</span>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span className="font-medium">{claimerName}</span>
                  </div>
                </div>
              )}

              {/* Posted By */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-muted-foreground">Posted By</span>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{posterName}</span>
                </div>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                size="lg"
                variant="outline"
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border transition-all duration-200
        ${food.status === 'active'
                    ? 'bg-[#b6985a] text-white hover:brightness-110 hover:shadow-md'
                    : 'bg-zinc-800 text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleClaimFood}
                disabled={food.status !== 'active'}
              >
                <ShieldCheck className="h-4 w-4" />
                {food.status === 'active'
                  ? 'Claim Now'
                  : food.status.charAt(0).toUpperCase() + food.status.slice(1)}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/30"
                onClick={() => window.open(`https://wa.me/${food.contact}`, '_blank')}
              >
                <FaWhatsapp className="h-4 w-4 text-green-600 dark:text-green-400" />
                Chat with Seller
              </Button>
            </div>



            {/* Show Popup if current user claimed */}
            {showClaimedPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300" />

                {/* Modal Content */}
                <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-5 sm:p-6 animate-in slide-in-from-bottom fade-in z-10 border border-gray-200 dark:border-zinc-700">

                  {/* Close Button */}
                  <button
                    onClick={() => setShowClaimedPopup(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {/* Modal Body */}
                  <div className="text-center space-y-5 mt-6">
                    <h2 className="text-2xl md:text-3xl  font-bold text-green-600 dark:text-green-400 flex justify-center items-center gap-2">
                      <span>🎉</span> Claimed Successfully!
                    </h2>

                    <p className="text-muted-foreground text-base  sm:text-xs leading-relaxed ">
                      This food item has been claimed. Please collect it responsibly and on time to reduce waste and support the community.
                    </p>

                    <p className="text-sm text-muted-foreground italic">
                      Claimed by: <span className="font-medium text-foreground">{claimerName}</span>
                    </p>

                    {/* Route Map */}
                    <RouteMap
                      senderLat={food.lat}
                      senderLng={food.lng}
                      claimerLat={food.claimerLat}
                      claimerLng={food.claimerLng}
                    />

                    <button
                      onClick={() => setShowClaimedPopup(false)}
                      className="mt-4 px-6 py-2.5 bg-[#b6985a] text-white rounded-full shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              </div>
            )}


          </div>




        </div>
      </div>

      {/* new Ui */}


      <ToastContainer position="top-center" />

      <Footer />
    </div>
  );
}


