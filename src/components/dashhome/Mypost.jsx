// 'use client';
// import React, { useEffect } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { app } from '@/lib/firebaseConfig'; // Make sure you import your Firebase app correctly

// const Mypost = () => {
//     useEffect(() => {
//         const auth = getAuth(app);

//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 try {
//                     const res = await fetch(`/api/mypost?uid=${user.uid}`, {
//                         method: 'GET',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                     });

//                     const data = await res.json();
//                     console.log("✅ My posts data:", data);
//                 } catch (err) {
//                     console.error("❌ Error fetching my posts:", err);
//                 }
//             } else {
//                 console.log("⚠️ No user is signed in.");
//             }
//         });

//         return () => unsubscribe(); // cleanup
//     }, []);

//     return (
//         <>
//             <h1>Mypost</h1>
//         </>
//     );
// };

// export default Mypost;



"use client";

import React, { useEffect, useRef, useState, } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function Mypost() {
  const [foodList, setFoodList] = useState([]);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 2 : 4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [loading, setLoading] = useState(false);




  useEffect(() => {
    const fetchFoodItemsWithUserInfo = async () => {
      try {
        const res = await fetch("/api/getfood/");
        const data = await res.json();
        const foodItems = data.foods || [];
        console.log("✅ Fetched food items:", foodItems);

        const enrichedItems = await Promise.all(
          foodItems.map(async (item) => {
            try {
              const userRes = await fetch(`/api/cuserinfo/${item.uid}`);
              const userData = await userRes.json();
              return {
                ...item,
                postedBy: {
                  name: userData.user.name || "Anonymous",
                  image: userData.image || "/placeholder.svg",
                },
              };
            } catch (err) {
              console.error(`Error fetching user for uid ${item.uid}`, err);
              return {
                ...item,
                postedBy: {
                  name: "Unknown",
                  image: "/placeholder.svg",
                },
              };
            }
          })
        );

        setFoodList(enrichedItems);
      } catch (err) {
        console.error("❌ Error fetching food items:", err);
      }
    };

    fetchFoodItemsWithUserInfo();
  }, []);


  const handleScroll = (direction) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.firstChild?.offsetWidth || 250;
    const maxScroll = (foodList.length - itemsPerView) * cardWidth;

    const newX =
      direction === "left"
        ? Math.max(translateX - cardWidth, 0)
        : Math.min(translateX + cardWidth, maxScroll);

    setTranslateX(newX);
  };

  const handleViewMore = async (id) => {
    setLoading(true);
    toast.info("Loading food details...");

    try {
      router.push(`/fooddetails/${id}`);
    } catch (err) {
      toast.error("Failed to navigate to details.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <section className="py-10 px-4 sm:px-6 md:px-28 relative">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center text-gray-900 dark:text-white mb-6 leading-tight">
        🍽️ Available Food Items
      </h2>


      {/* Scroll Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleScroll("left")}
        disabled={translateX === 0}
        className="absolute left-15 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-full shadow"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-100" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleScroll("right")}
        disabled={
          translateX >=
          (foodList.length - itemsPerView) *
          (containerRef.current?.firstChild?.offsetWidth || 250)
        }
        className="absolute right-15 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-full shadow"
      >
        <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-100" />
      </Button>


      {/* Cards */}
      <div className="overflow-x-auto md:overflow-hidden p-2">
        <div
          className="flex gap-4 transition-transform duration-500"
          style={{
            transform: `translateX(-${translateX}px)`,
          }}
          ref={containerRef}
        >
          {foodList.map((item, index) => (
            <Card
              key={item.id || index}
              className="w-[240px] shrink-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform bg-white dark:bg-zinc-800 p-0"
            >
              <div className="w-full h-[140px] overflow-hidden">
                <img
                  src={item.image || "https://bio.bookingjini.tech/hukam-holiday/new-site/hukum_images/rooms/1.jpg"}
                  alt={item.name || "Food Image"}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-4">
                <h4 className="text-center text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {item.title || "Untitled"}
                </h4>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8 bg-gray-200">
                    <AvatarImage
                      src={item.postedBy?.image || "/placeholder.svg"}
                      alt={item.postedBy?.name || "User"}
                    />
                    <AvatarFallback className="flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {(item.postedBy?.name?.split(" ").slice(0, 2).join(" ")) || "Unknown User"}
                    </span>



                    <Badge
                      className={`w-fit mt-1 text-[10px] 
                         ${item.status === "active" ? "bg-green-500 text-white"
                          : item.status === "claimed" ? "bg-yellow-400 text-black"
                            : item.status === "expired" ? "bg-red-500 text-white"
                              : "bg-gray-300 text-black"}
                               `}
                    >
                      {item.status}
                    </Badge>

                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full text-xs hover:bg-gray-100 dark:hover:bg-zinc-700"
                  onClick={() => handleViewMore(item._id)} // ✅ Pass ID here
                  disabled={loading}
                >
                  {loading ? "Loading..." : "View More"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}




