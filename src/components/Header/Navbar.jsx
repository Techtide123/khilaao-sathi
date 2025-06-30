// import React from 'react'
// import { FiLogOut } from 'react-icons/fi';
// import { useAuth } from '@/lib/authContext';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import Link from 'next/link';

// const Navbar = () => {
//     const { user, loading, logout } = useAuth();
//     const router = useRouter();

//     useEffect(() => {
//         if (!loading && !user) {
//             router.push('/login');
//         }
//     }, [loading, user]);
//     const handleLogout = async () => {
//         await logout();
//         toast.success("Logged out successfully!");
//         router.push('/login');
//     };


//     return (
//         <>
//             <header className="flex justify-between items-center px-4 py-3 bg-white shadow-md border-b border-gray-100 rounded-b-xl sticky top-0 z-50">
//                 <div className="flex flex-col text-sm text-gray-800 leading-tight">
//                     <span className="text-xs text-gray-500">Hey There 👋</span>
//                     <span className="text-[13px] font-semibold text-[#b6985a] truncate max-w-[8rem]">
//                         {user?.displayName || user?.email}
//                     </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                     {user && (
//                         <div className="w-10 h-10 rounded-full shadow-md border-2 border-[#b6985a] overflow-hidden">
//                             <Link href="/dashboard">
//                             <img
//                                 src={user.photoURL || "/user.png"}
//                                 alt="profile"
//                                 className="w-full h-full object-cover"
//                             />
//                             </Link>
//                         </div>
//                     )}
//                     <button
//                         onClick={handleLogout}
//                         className="p-2 rounded-full shadow hover:shadow-lg transition-all duration-300 bg-[#fef9f3] border border-[#b6985a] text-[#b6985a] hover:bg-[#fff4dc]"
//                         title="Logout"
//                     >
//                         <FiLogOut size={18} />
//                     </button>
//                 </div>
//             </header>

//         </>
//     )
// }

// export default Navbar



"use client";

import { use, useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Menu,
    User,
    LogIn,
    UserPlus,
    Settings,
    LogOut,
    Mountain,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Moon, Sun } from "lucide-react"
import useUserStore from "@/store/userStore";






export default function Component() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // simulate login
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false)
    const [userData, setUserData] = useState(null);
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const { users, isLoading, fetchUsers } = useUserStore()
    const [myUser, setMyUser] = useState(null);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark)
    }, [isDark])


    const navigationItems = [
        { name: "Home", href: "/dashboard" },
        { name: "About", href: "/about" },
        { name: "Post Food", href: "/foodform" },
        { name: "Find Food", href: "/allfoods" },
        { name: "Contact", href: "/contact" },
    ];


    // for scroll navbar Effects
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // for scroll navbar Effects


    // Fetching Ther user data
    // useEffect(() => {
    //     if (loading) return; // Wait until auth is loaded

    //     if (!user) {
    //         toast.error("Login required!");
    //         router.push('/login');
    //         return;
    //     }
    //     const fetchUserData = async () => {
    //         try {
    //             const res = await fetch(`/api/cuserinfo/${user.uid}`); // Replace with your API route
    //             const resdata = await res.json();
    //             // console.log("User data:", resdata.user.profileImage);
    //             setUserData(resdata.user);
    //         } catch (err) {
    //             console.error("Error fetching user data:", err);
    //         }
    //     };

    //     fetchUserData();
    // }, [loading, user]);
    // Fetching Ther user data


    // Log out function
    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully!");
        router.push('/login');
    };
    // Log out function





    // fetchin the user infor 

    useEffect(() => {
        // 1. Check if user list is not loaded yet
        if (!users || users.length === 0) {
            fetchUsers(); // fetch from backend and store in Zustand
        }

    }, [users, fetchUsers])


    useEffect(() => {
        if (users && user) {
            const myUser = users.find((u) => u.uid === user.uid);
            setMyUser(myUser);
        }

    }, [users, user]);


    // fetchin the user infor 




    return (
        
        <header
            className={`fixed z-50 transition-all duration-500 border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg rounded-xl
        ${scrolled ? "top-[20px]" : "top-0.5"}
        ${scrolled ? "sm:w-[60%]" : "sm:w-[70%]"}
        w-full
        left-0 sm:left-1/2 sm:-translate-x-1/2`}
        >
            <div className="flex h-16 items-center justify-between px-4">

                {/* Logo and Navigation (centered) */}
                <div className="flex flex-1 justify-center md:justify-evenly items-center gap-x-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Mountain className="h-6 w-6" />
                        <span className="text-lg font-bold">Khilaoo Sathi</span>
                    </Link>

                    {/* Navigation Items (hidden on mobile) */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={item.href}
                                            className="text-sm font-medium px-3 py-2 hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    {/* Avatar Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={myUser ?.profileImage || "/placeholder.jpg"} alt="User"   className="h-8 w-8 rounded-full object-contain" />
                                    <AvatarFallback>
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            {user ? (
                                <>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{myUser?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{myUser?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/login')}>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        <span>Login</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/signup')}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        <span>Sign Up</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>


                    </DropdownMenu>
                </div>

                {/* Right-side Controls: Mobile Menu + Avatar */}
                <div className="flex items-center gap-x-2">

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="p-2">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="pr-0">
                                <SheetHeader>
                                    <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
                                </SheetHeader>

                                <div className="pl-4 pt-4 space-y-4">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block text-base text-foreground/80 hover:text-foreground"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        aria-label="Toggle Dark Mode"
                        className="inline-flex items-center justify-center px-2 py-2 rounded-4xl bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>

                </div>
            </div>
            <ToastContainer position="top-center" />
        </header>



    );
}
