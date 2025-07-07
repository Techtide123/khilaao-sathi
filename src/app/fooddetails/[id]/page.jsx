'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

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

import { Button } from '@/components/ui/button';
import { Star, Truck, ShieldCheck, Heart, Landmark, UserCheck, User, Clock, Users, X, LoaderIcon } from "lucide-react";
import FullScreenLoader from '@/components/ui/FullScreenLoader'
import usefoodStore from '@/store/foodStore'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function FoodDetailsPage() {

  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [showClaimedPopup, setShowClaimedPopup] = useState(false);
  const [claimerName, setClaimerName] = useState("");
  const [posterName, setPosterName] = useState("");



  const [foodItem, setFoodItem] = useState(null)
  const { data, isLoading, fetchData } = usefoodStore();


  const [user, setUser] = useState(null);




  // Fetchin the data from the Zustant store ##FOODDATA##
  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  // Fetch data if not already loaded
  useEffect(() => {
    if (!data) {
      fetchData()
    }
  }, [data, fetchData])

  // Find item by ID once data is ready
  useEffect(() => {
    if (data && id) {
      const item = data.find((f) => f._id.toString() === id.toString());
      setFoodItem(item)
    }
  }, [data, id])

  // Fetchin the data from the Zustant store ##FOODDATA##


  // console.log("🚀 ~ file: page.jsx:39 ~ FoodDetailsPage ~ foodItem:", foodItem)

  // useEffect(() => {
  //   async function fetchFood() {
  //     const res = await fetch(`/api/fooddetails/${id}`);
  //     const resdata = await res.json();
  //     setFood(resdata.food);
  //     console.log(resdata.food);
  //   }

  //   fetchFood();
  // }, [id]);

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

    if (foodItem?.lat && foodItem?.lng) {
      reverseGeocode(foodItem.lat, foodItem.lng);
    }
  }, [foodItem]);

  useEffect(() => {
    if (foodItem?.status === 'claimed' && foodItem?.claimedBy) {
      setShowClaimedPopup(true);


      // Fetch claimer name from backend
      const fetchClaimerName = async () => {
        try {
          const res = await fetch(`/api/cuserinfo/${foodItem.claimedBy}`);
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
  }, [foodItem]);

  useEffect(() => {
    if (foodItem?.uid) {
      const fetchPosterName = async () => {
        try {
          const res = await fetch(`/api/cuserinfo/${foodItem.uid}`);
          const data = await res.json();
          // console.log("Poster info =============================================:", data.user);

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
  }, [foodItem]);

  if (food && !food.images) {
    food.images = [
      "https://res.cloudinary.com/demo/image/upload/v1695062396/sample.jpg",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
    ];
  }


  if (!foodItem) {
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
    if (user.uid === foodItem.uid) {
      toast.warning("You cannot claim your own food post.");
      // alert(food.uid +" :: " + user.uid);
      return;
    }

    if (foodItem.status === 'active') {


      // ✅ Get current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const claimerLat = position.coords.latitude;
        const claimerLng = position.coords.longitude;

        try {
          const res = await fetch('/api/claimfood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              foodId: foodItem._id,
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
      if (foodItem.status === 'claimed') msg = "This food has already been claimed.";
      else if (foodItem.status === 'expired') msg = "This food post has expired.";
      else msg = `This food is currently marked as: ${foodItem.status}`;

      toast.info(msg);

    }
  };





  // Paynow btn function
  const handlePayment = async (price) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to make a payment.");
      return;
    }
    if (user.uid === foodItem.uid) {
      toast.warning("Oops! You can't pay for your own post.");
      return;
    }

    try {
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price }),
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Khiallo Satthi",
        description: "Food Donation Payment",
        // ✅ Only called if payment is successful
        handler: async (response) => {
          toast.success("✅ Payment successful!");

          // ✅ Call claim after payment
          await handleClaimFood();
        },

        prefill: {
          name: posterName.displayName,
          email: posterName.email,
          contact: posterName.phone, // optional
        },
        theme: { color: "#b6985a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong during payment.");
      console.error(err);
    }
  };





  return (
    <div className="flex flex-col min-h-screen 
  bg-gradient-to-b from-gray-100 to-gray-200 
  dark:from-zinc-900 dark:to-zinc-800"
    >

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
              {(foodItem?.images || []).map((imgUrl, idx) => (
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
            <div className="flex items-center gap-4 mb-4 justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
               ${foodItem?.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}
              >
                {foodItem?.status.charAt(0).toUpperCase() + foodItem?.status.slice(1)}
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer 
             bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 
             flex items-center gap-1 w-fit transition-all hover:brightness-105"
                onClick={() => window.open(`https://wa.me/${foodItem?.contact}`, '_blank')}
              >
                <FaWhatsapp className="h-4 w-4" />
                Chat
              </span>


              <span
                className="inline-block px-2 py-1 rounded-full text-sm font-semibold
             bg-blue-50 text-blue-700
             dark:bg-blue-900/30 dark:text-blue-300
             border border-blue-200 dark:border-blue-800
             shadow-md backdrop-blur-sm"
              >
                ₹{foodItem?.price}
              </span>


            </div>

            {/* Title */}
            <h1 className=" text-2xl md:text-3xl font-bold mb-2 text-foreground"> {foodItem?.title}</h1>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{foodItem?.description}</p>

            {/* Location Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${foodItem?.lat},${foodItem?.lng}`}
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
                <span className="font-medium text-foreground">Food Details</span>
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted: {new Date(foodItem?.postedAt).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>People Count: {foodItem?.peopleCount ?? "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Claimed & Poster Info */}

            <div className="flex  flex-col md:flex-row gap-4   md:gap-12 bg-muted/10 p-4 rounded-xl border mt-6">
              {foodItem?.status === 'claimed' && (
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
              {/* CLAIM NOW Button */}
              {foodItem?.status === 'active' ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="inline-flex items-center justify-center gap-2 
          px-6 py-3 rounded-xl 
          bg-gradient-to-r from-indigo-600 to-violet-600 
          text-white text-base font-semibold 
          hover:from-indigo-700 hover:to-violet-700 
          dark:from-indigo-400 dark:to-violet-500 
          shadow-md hover:shadow-lg 
          transition-all duration-200 ease-in-out"
                    >
                      <span className="text-lg">💳</span>
                      Pay ₹{foodItem?.price}
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Proceed to Payment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to pay ₹{foodItem?.price}? This food will be marked as claimed once paid.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePayment(foodItem?.price)}
                      >
                        Yes, Pay Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  disabled
                  className="flex items-center justify-center gap-2 rounded-lg 
      bg-red-100 text-red-700 
      dark:bg-red-900 dark:text-red-300 
      cursor-not-allowed shadow-md transition-all font-semibold"
                >
                  {foodItem?.status === 'claimed' && '🚫 Already Claimed'}
                  {foodItem?.status === 'expired' && '⏳ Expired'}
                  {foodItem?.status !== 'claimed' && foodItem?.status !== 'expired' && '❌ Not Available'}
                </Button>
              )}

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
                      senderLat={foodItem.lat}
                      senderLng={foodItem.lng}
                      claimerLat={foodItem.claimerLat}
                      claimerLng={foodItem.claimerLng}
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


    </div>
  );
}


