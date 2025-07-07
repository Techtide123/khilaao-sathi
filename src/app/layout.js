'use client';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/lib/authContext';
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Header/Navbar";
import { Footer } from "@/components/Footer/Footer";
// app/layout.js or app/root-layout.js
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "Khilaao Sathi | Share Food, Spread Kindness",
  description:
    "Donate your extra food with Khilaao Sathi and help those in need. Post food, find available meals nearby, and fight food waste together.",
};





export default function RootLayout({ children }) {


  const pathname = usePathname();
  const [showLayout, setShowLayout] = useState(true);

  useEffect(() => {
    // Hide layout for specific pages like '/login', '/pannel'
    const hiddenRoutes = ['/login', '/pannel', '/signup', '/']; // add more paths if needed
    setShowLayout(!hiddenRoutes.includes(pathname));
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        {/* OneSignal SDK */}
        <Script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignal = window.OneSignal || [];
            OneSignal.push(function() {
              OneSignal.init({
                 appId: "2f29bcd6-5045-4401-9eab-86396a513109", // Replace this
                notifyButton: {
                  enable: true,
                },
              });
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <AuthProvider>
          {showLayout && <Navbar />}
          {children}
          {showLayout && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
