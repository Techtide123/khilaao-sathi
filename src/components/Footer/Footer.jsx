'use client';
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Mountain } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <section className="relative py-32 px-6 sm:px-10 lg:px-32 bg-muted/40 shadow-inner">
      <div className="relative z-10 container mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start">
          {/* Logo + Description */}
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <div className="flex items-center gap-2 lg:justify-start">
              <Link href="/" className="flex items-center space-x-2">
                <Mountain className="h-6 w-6" />
                <span className="text-lg font-bold">Khilaao Sathi</span>
              </Link>
            </div>
            <p className="text-muted-foreground max-w-[80%] text-sm">
              Connecting hearts through meals. Join us in reducing food waste and feeding those in need.
            </p>
            <ul className="text-muted-foreground flex items-center space-x-6">
              <li className="hover:text-primary transition-colors">
                <a href="#" aria-label="Instagram"><FaInstagram className="size-5" /></a>
              </li>
              <li className="hover:text-primary transition-colors">
                <a href="#" aria-label="Facebook"><FaFacebook className="size-5" /></a>
              </li>
              <li className="hover:text-primary transition-colors">
                <a href="#" aria-label="Twitter"><FaTwitter className="size-5" /></a>
              </li>
              <li className="hover:text-primary transition-colors">
                <a href="https://www.linkedin.com/in/shitansu-kumar-gochhayat-91b7a5241" aria-label="LinkedIn">
                  <FaLinkedin className="size-5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Sections */}
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            <div>
              <h3 className="mb-4 text-base font-bold text-primary">Get Involved</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li><a href="/foodform" className="hover:text-primary font-medium">Donate Food</a></li>
                <li><a href="#fooditems" className="hover:text-primary font-medium">View All Foods</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Partner With Us</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-base font-bold text-primary">About</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li><a href="#" className="hover:text-primary font-medium">Our Mission</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Impact</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Team</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-base font-bold text-primary">Support</h3>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li><a href="#" className="hover:text-primary font-medium">FAQs</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Help Center</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary font-medium">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-muted-foreground mt-12 flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs font-medium md:flex-row md:items-center">
          <p>© 2025 Khilaao Sathi. All rights reserved.</p>
          <ul className="flex flex-col gap-2 md:flex-row md:space-x-6">
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
    <div className="mt-8 text-center">
  <p
    className="text-sm text-foreground/70 font-semibold tracking-tight"
    style={{ fontFamily: `'Inter', sans-serif`, letterSpacing: "-0.015em" }}
  >
    Powered by{" "}
    <a
      href="https://www.linkedin.com/in/shitansu-kumar-gochhayat-91b7a5241"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary font-semibold underline underline-offset-4 hover:text-primary/80 transition-colors"
      style={{ fontFamily: `'Inter', sans-serif` }}
    >

      Shitansu Kumar Gochhayat
    </a>
  </p>
</div>


      </div>
    </section>
  );
};
