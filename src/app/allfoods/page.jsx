'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import usefoodStore from '@/store/foodStore';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import ProtectedRoute from '@/components/ProtectedRoute';



const Allfoods = () => {
    const { data, isLoading, fetchData } = usefoodStore();
    const router = useRouter()
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data ? data.filter((food) => {
        if (filter === "all") return true;
        return food.status?.toLowerCase() === filter;
    }) : [];


    if (isLoading) return <FullScreenLoader />

    return (
        <>
            <ProtectedRoute>
                <div className='flex justify-center'>
                    <ToggleGroup
                        type="single"
                        value={filter}
                        onValueChange={(value) => value && setFilter(value)}
                        className="flex justify-center flex-wrap gap-3 mt-30 "
                    >
                        {["all", "active", "expired", "claimed"].map((status) => (
                            <ToggleGroupItem
                                key={status}
                                value={status}
                                className={`
        px-5 py-2.5 rounded-full text-sm font-semibold transition
        border border-border bg-muted text-foreground
        data-[state=on]:bg-purple-600 data-[state=on]:text-white
        hover:bg-red-500 hover:text-white
      `}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                </div>
                <div className="max-w-6xl mx-auto px-4 py-10 bg-background text-foreground">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredData.map((food) => (
                            <div
                                key={food._id}
                                className="max-w-xs w-full rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-500 cursor-pointer border border-muted bg-card"
                            >
                                {/* Image Section */}
                                <div className="relative w-full h-48">
                                    <Image
                                        src={food?.images?.[0] || '/placeholder.jpg'}
                                        alt="food image"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 96px, 96px"
                                        quality={100}
                                        priority
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="py-4 px-4 space-y-2">
                                    {/* Title and Avatar in Row */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-md font-semibold truncate w-4/5">
                                            {food.title}
                                        </h3>
                                        <Avatar className="h-8 w-8 bg-gray-200 shrink-0">
                                            <AvatarImage
                                                src="/placeholder.jpg"
                                                alt={food.postedBy?.name || "User"}
                                            />
                                            <AvatarFallback className="flex items-center justify-center">
                                                <User className="h-4 w-4 text-gray-600" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Status Badge */}
                                    <Badge
                                        className={`w-fit text-[10px] px-2 py-0.5 rounded-md 
        ${food.status === "active" ? "bg-green-500 text-white"
                                                : food.status === "claimed" ? "bg-yellow-400 text-black"
                                                    : food.status === "expired" ? "bg-red-500 text-white"
                                                        : "bg-gray-300 text-black"}
      `}
                                    >
                                        {food.status}
                                    </Badge>

                                    {/* View More Button */}
                                    <Button
                                        variant="secondary"
                                        className="w-full flex items-center gap-2 cursor-pointer"
                                        onClick={() => { router.push(`/fooddetails/${food._id}`) }}
                                    >
                                        <ShoppingCart className="h-5 w-5" /> View More
                                    </Button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}

export default Allfoods