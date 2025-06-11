'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { PiCheckCircleBold } from 'react-icons/pi';
import Navbar from '@/components/Header/Navbar';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default function FoodDetailsPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    async function fetchFood() {
      const res = await fetch(`/api/fooddetails/${id}`);
      const data = await res.json();
      setFood(data.food);
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

  if (!food) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  food.images = [
    "https://res.cloudinary.com/demo/image/upload/v1695062396/sample.jpg",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  ];

  return (
    // <>
    //   <Navbar />
    //   <div className="max-w-md mx-auto p-4 space-y-4">

    //     {/* Image Slider */}
    //     <Swiper
    //       pagination={{ clickable: true }}
    //       modules={[Pagination]}
    //       className="w-full h-52 rounded-xl overflow-hidden"
    //     >
    //       {(food.images || []).map((imgUrl, idx) => (
    //         <SwiperSlide key={idx}>
    //           <img
    //             src={imgUrl}
    //             alt={`Food Image ${idx}`}
    //             className="w-full h-52 object-cover"
    //           />
    //         </SwiperSlide>
    //       ))}
    //     </Swiper>



    //     {/* Title & Description */}
    //     <h1 className="text-2xl font-semibold text-[#b6985a]">{food.title}</h1>
    //     <p className="text-gray-700">{food.description}</p>

    //     {/* Location */}
    //     <div className="flex items-center gap-2 text-sm text-gray-700">
    //       <FaMapMarkerAlt className="text-red-500" />
    //       <span>{locationName}</span>
    //       <a
    //         href={`https://www.google.com/maps?q=${food.lat},${food.lng}`}
    //         target="_blank"
    //         className="text-blue-600 underline ml-2"
    //       >
    //         View on Map
    //       </a>
    //     </div>

    //     {/* More Info */}
    //     <div className="text-sm text-gray-600 space-y-2">
    //       <div className="flex items-center gap-2">
    //         <MdAccessTime className="text-blue-500" />
    //         <span>Posted: {new Date(food.postedAt).toLocaleString()}</span>
    //       </div>
    //       <div className="flex items-center gap-2">
    //         <PiCheckCircleBold className="text-green-600" />
    //         <span>Status: <span className="capitalize">{food.status}</span></span>
    //       </div>
    //       <div className="flex items-center gap-2">
    //         <span className="font-medium">People:</span> {food.peopleCount}
    //       </div>
    //     </div>

    //     {/* WhatsApp Button */}
    //     <a
    //       href={`https://wa.me/${food.contact}`}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="mt-4 block w-full text-center bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
    //     >
    //       <FaWhatsapp className="inline-block mr-2" />
    //       Chat on WhatsApp
    //     </a>


    //   </div>
    // </>
     
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
      </div>
    </>
    );
}
