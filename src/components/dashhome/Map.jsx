// 'use client';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const MapClient = ({ posts }) => {
//   const defaultCenter = [20.295, 85.818];

//   return (
//     <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={false} className="h-[200px] w-full rounded-lg z-0">
//       <TileLayer
//         attribution="&copy; OpenStreetMap contributors"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {posts.map((post) => (
//         <Marker key={post._id} position={[post.lat, post.lng]}>
//           <Popup>
//             <strong className="text-lg">{post.title}</strong><br />
//             <p>👥 {post.peopleCount}</p>{post.description}<br />
//             <p> 📞 {post.contact}</p>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default MapClient;





import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});



export default function MapClient({ posts }) {
  const defaultCenter = [20.295, 85.818];
  const router = useRouter();
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="bg-primary/10 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
      <div className="bg-primary/5 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl" />

      <div className="relative container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-5 md:gap-12 md:py-20 lg:py-24 xl:gap-16 2xl:max-w-[1400px]">
        {/* Text column - takes 3/5 on desktop, full on mobile */}
        <div className="flex flex-col justify-center md:col-span-3 md:pr-6 xl:pr-12">
          <div className="space-y-6 md:space-y-8">
            {/* Label with dots */}
            <div className="flex items-center space-x-3">
              <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
              <h2 className="text-primary text-sm font-semibold tracking-wider uppercase">
                Nearby Meals, Just a Tap Away
              </h2>
            </div>

            {/* Main heading with multi-line approach */}
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="block">Find Food</span>
              <span className="text-primary mt-1 block">Near You, Instantly</span>
            </h1>

            {/* Description text */}
            <p className="text-muted-foreground max-w-xl text-lg">
              With Khialoo Sathi, locating nearby food donation points or free meal services is just a tap away. Whether you're in need or want to help, our platform connects you with real-time locations offering food assistance in your area.
            </p>

            {/* Featured clients section */}
            <div className="pt-2">
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                TRUSTED BY
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-muted-foreground/70 hover:text-foreground font-semibold transition-colors">
                  FoodBridge
                </div>
                <div className="text-muted-foreground/70 hover:text-foreground font-semibold transition-colors">
                  Seva Foundation
                </div>
                <div className="text-muted-foreground/70 hover:text-foreground font-semibold transition-colors">
                  HungerHelp
                </div>
                <div className="text-muted-foreground/70 hover:text-foreground font-semibold transition-colors">
                  MealsOnWay
                </div>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group" onClick={() => router.push("/foodform")}>
                Donate Food
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <a href="#fooditems">
                <Button variant="outline" size="lg" className="group">
                  Find Food
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
                </Button>
              </a>
            </div>
          </div>
        </div>




        {/* Image column - takes 2/5 on desktop, full on mobile */}
        <div className="relative flex aspect-[4/5] w-full items-center md:col-span-2 md:aspect-auto md:h-[600px]">
          {/* Decorative element */}
          <div className="border-primary/20 bg-background/50 absolute -top-6 -right-6 h-20 w-20 rounded-md border backdrop-blur-sm"></div>

          {/* Main image with frame */}
          <div className="relative z-10 w-full h-[600px] overflow-hidden rounded-2xl border border-muted/30 bg-muted/10 shadow-xl">
            <MapContainer
              center={defaultCenter}
              zoom={9}
              scrollWheelZoom={false}
              className="h-[100vh] w-full z-10 rounded-lg"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {posts.map((post) => (
                <Marker key={post._id} position={[post.lat, post.lng]}>
                  <Popup>
                    <strong className="text-lg">{post.title}</strong><br />
                    <p>👥 {post.peopleCount}</p>{post.description}<br />
                    <p> 📞 {post.contact}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Optional gradient overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>


          {/* Decorative element */}
          <div className="border-primary/10 bg-background/50 absolute -bottom-6 -left-6 h-24 w-24 rounded-full border backdrop-blur-sm"></div>
        </div>
      </div>
    </div>
  );
}
