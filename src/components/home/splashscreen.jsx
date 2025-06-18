'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'], // or ['400'] if you want just one weight
});


export default function SplashScreen() {
  const router = useRouter();

  return (
    <>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#ede9fe] via-white to-[#f8fafc] py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
          <Image src="/welcome.png" alt="Logo" width={400} height={100} className="mx-auto" />
          {/* Announcement Banner */}
          <div className="flex justify-center">
            <Link
              className="inline-flex items-center gap-x-2 rounded-full border border-[#580FC2]/20 bg-white p-1 ps-3 text-sm text-[#580FC2] shadow-sm transition hover:bg-[#580FC2]/5"
              href="/login"
            >
              🚀 New Feature Alert!
              <span className="bg-[#580FC2]/10 inline-flex items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-semibold text-[#580FC2]">
                Join with us
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Title */}
          <div className="mx-auto mt-6 max-w-2xl text-center">
            <h1 className=" font-extrabold tracking-tight text-gray-900   sm:text-5xl text-4xl md:tracking-widest	">
              Feed Hope with <br /> <span className={`${dancingScript.className} text-[#580FC2]  text-4xlsm:text-4xl tracking-wide `}>
                Khilaao Sathi
              </span>

            </h1>
          </div>

          {/* Subtitle */}
          <div className="mx-auto mt-4 max-w-3xl text-center">
            <p className="text-xl text-gray-600">
              Connecting hearts through food — donate or claim meals around you, instantly and with care.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="bg-[#4c0aae] hover:bg-[#4c0aaed9] text-white rounded-4xl " onClick={() => router.push('/login')}>
              Get Started with Us <ChevronRightIcon className="w-4 h-4" />
            </Button>

          </div>

        </div>
      </div>


      {/* End Hero */}
    </>
  );
}
