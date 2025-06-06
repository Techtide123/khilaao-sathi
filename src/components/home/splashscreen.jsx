'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();
  const getData = async () => {
    router.push('/login');
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br  md:hidden px-6" style={{backgroundImage: "url('/loginbg.webp')"}}>
      {/* App Logo */}
      <div className="mb-6">
        <Image
          src="/entry.webp" // your logo path
          alt="App Logo"
          width={120}
          height={120}
          style={{ width: '100%', height: 'auto', marginTop: '-20px' }}
          priority
          className=""
        />
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-700   tracking-tight text-center">
          Explore Your World
        </h1>
        <p className="text-gray-600 dark:text-gray-600 mb-8 text-sm text-center " style={{ marginTop: '5px', fontSize: '13px' }}>Lorem ipsum dolor sit  sef wwfe scssc xq amet consectetur adipiscing elit ut aliquam purus rhoncus dolor purus non enim praesent elementum facilisis leo vel fringilla vestibulum ante ipsum primis in faucibus orci luctus.</p>
      </div>

      {/* Tagline */}
      <h1 className="text-white text-center text-2xl font-extrabold mb-8 drop-shadow-md">

      </h1>



      {/* Get Started Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r  from-yellow-400 to-yellow-500 hover:from-green-500 hover:to-green-700 text-white text-lg font-semibold py-2 rounded-xl shadow-lg transition-all duration-300"
        onClick={getData}
      >
        Let's Go
      </button>
    </div>
  );
}
