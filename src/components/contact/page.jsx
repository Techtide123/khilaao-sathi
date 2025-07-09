'use client';

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const ContactPage = () => (
  <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4 md:px-10 flex items-center justify-center" id="contactPage">
    <div className="text-center max-w-5xl w-full">
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wide">
        Contact Us
      </p>
      <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Get In Touch
      </h2>
      <p className="mt-4 text-base md:text-lg text-zinc-600 dark:text-zinc-300">
        Our friendly team is always here to help and answer any questions you might have.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Email */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow border border-zinc-200 dark:border-zinc-700 text-center flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-zinc-800 dark:text-white">Email</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Our support team will get back to you ASAP.
          </p>
          <Link
            href="mailto:shitansukumargochhayat@gmail.com"
            className="mt-4 dark:text-indigo-400 font-medium hover:underline"
          >
            shitansukumargochhayat@gmail.com
          </Link>
        </div>

        {/* Office */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow border border-zinc-200 dark:border-zinc-700 text-center flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-zinc-800 dark:text-white">Office</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Come say hello at our HQ.
          </p>
          <Link
            href="https://map.google.com"
            target="_blank"
            className="mt-4 dark:text-green-400 font-medium hover:underline"
          >
            Near Khandagiri Chowk,<br />Bhubaneswar
          </Link>
        </div>

        {/* Phone */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow border border-zinc-200 dark:border-zinc-700 text-center flex flex-col items-center">
          <div className="h-12 w-12 flex items-center justify-center bg-pink-100 dark:bg-pink-900  dark:text-pink-300 rounded-full">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="mt-4 font-semibold text-lg text-zinc-800 dark:text-white">Phone</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Mon – Fri from 8am to 5pm
          </p>
          <Link
            href="tel:+917205121943"
            className="mt-4 dark:text-pink-400 font-medium hover:underline"
          >
          +91 7205121943
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
