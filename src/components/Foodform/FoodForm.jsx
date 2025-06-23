// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { useAuth } from "@/lib/authContext";

// // Fix Leaflet icon loading
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// export default function FoodPostForm() {
//   const [step, setStep] = useState(1);
//   const [locationMode, setLocationMode] = useState("current"); // current | manual

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     contact: "",
//     peopleCount: "",
//     lat: 20.2961,
//     lng: 85.8245,
//     images: [],
//   });

//   const [previews, setPreviews] = useState([]);
//   const { user } = useAuth();

//   // 🌍 Auto-detect current location
//   useEffect(() => {
//     if (locationMode === "current" && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         const { latitude, longitude } = pos.coords;
//         setForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
//       });
//     }
//   }, [locationMode]);

//   // 🗺️ Component to allow location selection on map click
//   function LocationPicker() {
//     useMapEvents({
//       click(e) {
//         if (locationMode === "manual") {
//           setForm((prev) => ({
//             ...prev,
//             lat: e.latlng.lat,
//             lng: e.latlng.lng,
//           }));
//         }
//       },
//     });
//     return <Marker position={[form.lat, form.lng]} />;
//   }

//   // 📸 Handle image upload + preview
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (form.images.length + files.length > 3) {
//       alert("You can only upload up to 3 images.");
//       return;
//     }
//     const newImages = [...form.images, ...files];
//     const newPreviews = [...previews, ...files.map((file) => URL.createObjectURL(file))];

//     setForm({ ...form, images: newImages });
//     setPreviews(newPreviews);
//   };

//   // ❌ Remove image
//   const removeImage = (index) => {
//     const updatedImages = [...form.images];
//     const updatedPreviews = [...previews];
//     updatedImages.splice(index, 1);
//     updatedPreviews.splice(index, 1);
//     setForm({ ...form, images: updatedImages });
//     setPreviews(updatedPreviews);
//   };

//   // 🚀 Submit form
//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append("title", form.title);
//     formData.append("description", form.description);
//     formData.append("contact", form.contact);
//     formData.append("peopleCount", form.peopleCount);
//     formData.append("lat", form.lat);
//     formData.append("lng", form.lng);
//     formData.append("uid", user?.uid);

//     form.images.forEach((file) => formData.append("images", file));

//     const res = await fetch("/api/postfood", {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       alert("✅ Food post submitted!");
//       setForm({ title: "", description: "", contact: "", peopleCount: "", lat: 20.2961, lng: 85.8245, images: [] });
//       setPreviews([]);
//       setStep(1);
//     } else {
//       alert("❌ Failed to submit.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900/70 p-6 rounded-2xl shadow-xl space-y-6 mt-12">
//       <h2 className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">🍱 Food Donation Form</h2>

//       {/* Step 1: Food Info */}
//       {step === 1 && (
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="e.g., 2 plates of Chowmein"
//             className="w-full border  bg-white/70 dark:bg-zinc-800 p-2 rounded-lg text-black dark:text-white"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             required
//           />
//           <textarea
//             placeholder="Describe the food and context..."
//             className="w-full border  bg-white/70 dark:bg-zinc-800 p-2 rounded-lg text-black dark:text-white"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             required
//           />
//           <input
//             type="text"
//             placeholder="WhatsApp Number"
//             className="w-full border  bg-white/70 dark:bg-zinc-800 p-2 rounded-lg text-black dark:text-white"
//             value={form.contact}
//             onChange={(e) => setForm({ ...form, contact: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             placeholder="For how many people?"
//             className="w-full border  bg-white/70 dark:bg-zinc-800 p-2 rounded-lg text-black dark:text-white"
//             value={form.peopleCount}
//             onChange={(e) => setForm({ ...form, peopleCount: e.target.value })}
//             required
//           />
//           <div className="flex justify-end pt-4">
//             <Button onClick={() => setStep(2)}>Next</Button>
//           </div>
//         </div>
//       )}

//       {/* Step 2: Map + Images */}
//       {step === 2 && (
//         <div className="space-y-6">
//           {/* Location Controls */}
//           <div className="flex space-x-3">
//             <button
//               className={`px-4 py-2 rounded-lg font-medium transition ${locationMode === "current"
//                 ? "bg-yellow-600 text-white"
//                 : "bg-yellow-100 text-yellow-800 border"
//                 }`}
//               onClick={() => setLocationMode("current")}
//             >
//               📍 Current Location
//             </button>
//             <button
//               className={`px-4 py-2 rounded-lg font-medium transition ${locationMode === "manual"
//                 ? "bg-yellow-600 text-white"
//                 : "bg-yellow-100 text-yellow-800 border"
//                 }`}
//               onClick={() => setLocationMode("manual")}
//             >
//               🗺️ Pick on Map
//             </button>
//           </div>

//           {/* Map */}
//           <div className="h-[300px] rounded-xl overflow-hidden border shadow-inner">
//             <MapContainer
//               center={[form.lat, form.lng]}
//               zoom={15}
//               className="h-full w-full"
//               key={`${form.lat}-${form.lng}`}
//             >
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               <LocationPicker />
//             </MapContainer>
//           </div>

//           {/* Image Upload */}
//           <div className="space-y-2">
//             <label className="block font-medium text-yellow-600 dark:text-yellow-400">Upload up to 3 images</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageChange}
//               disabled={form.images.length >= 3}
//               className="w-full border  bg-white/70 dark:bg-zinc-800 p-2 rounded-lg text-black dark:text-white"
//             />
//             {previews.length > 0 && (
//               <div className="grid grid-cols-3 gap-2">
//                 {previews.map((src, idx) => (
//                   <div key={idx} className="relative group rounded-lg overflow-hidden shadow">
//                     <img src={src} alt={`Preview ${idx + 1}`} className="object-cover h-24 w-full" />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(idx)}
//                       className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full p-1 hover:bg-red-600 transition"
//                     >
//                       ✖
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex justify-between pt-4">
//             <Button variant="outline" onClick={() => setStep(1)}>
//               Back
//             </Button>
//             <Button onClick={handleSubmit}>Submit</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






'use client';

import { ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Fix Leaflet icon loading
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function FoodPostForm() {



  const [step, setStep] = useState(1);
  const [locationMode, setLocationMode] = useState("current"); // current | manual

  const [form, setForm] = useState({
    title: "",
    description: "",
    contact: "",
    peopleCount: "",
    lat: 20.2961,
    lng: 85.8245,
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);


  // 🌍 Auto-detect current location
  useEffect(() => {
    if (locationMode === "current" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({ ...prev, lat: latitude, lng: longitude }));
      });
    }
  }, [locationMode]);

  // 🗺️ Component to allow location selection on map click
  function LocationPicker() {
    useMapEvents({
      click(e) {
        if (locationMode === "manual") {
          setForm((prev) => ({
            ...prev,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          }));
        }
      },
    });
    return <Marker position={[form.lat, form.lng]} />;
  }

  // 📸 Handle image upload + preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (form.images.length + files.length > 3) {
      toast.warn("You can only upload up to 3 images.");
      return;
    }
    const newImages = [...form.images, ...files];
    const newPreviews = [...previews, ...files.map((file) => URL.createObjectURL(file))];

    setForm({ ...form, images: newImages });
    setPreviews(newPreviews);
  };

  // ❌ Remove image
  const removeImage = (index) => {
    const updatedImages = [...form.images];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setForm({ ...form, images: updatedImages });
    toast.success("Image removed.");
    setPreviews(updatedPreviews);
  };

  // 🚀 Submit form
  const handleSubmit = async () => {
    setIsLoading(true); // 🔄 Show loader

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("contact", form.contact);
    formData.append("peopleCount", form.peopleCount);
    formData.append("lat", form.lat);
    formData.append("lng", form.lng);
    formData.append("uid", user?.uid);

    form.images.forEach((file) => formData.append("images", file));

    try {


      const res = await fetch("/api/postfood", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("✅ Food post submitted!");
        setForm({ title: "", description: "", contact: "", peopleCount: "", lat: 20.2961, lng: 85.8245, images: [] });
        setPreviews([]);
        setStep(1);
      } else {
        toast.error("❌ Failed to submit.");
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false); // ✅ Hide loader
    }
  };



  return (
    <>
      {isLoading && <FullScreenLoader />}
      <section className=" py-32 md:py-42  px-4 md:px-30">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-2">

            {/* Left Side Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Badge variant="outline">
                ♻️ Share to Care
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>

              <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
                Donate Extra Food & Fight Waste
              </h1>

              <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
                Got extra food? Don’t throw it away. Post your food here and help someone in need. Together, we can reduce waste and spread kindness.            </p>

              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button asChild className="w-full sm:w-auto">
                  <a href="/dashboard#foodonmap">Find Food Via Map</a>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href="/dashboard#fooditems">
                    🔍 View Available Food
                    <ArrowRight className="size-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Side Image */}
            <div className=" md:w-xl mx-auto dark:bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-6 mt-12 border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-3xl font-semibold text-center">
                Share Food, Spread Hope
              </h2>

              <div className="flex flex-col gap-6">
                {/* Step 1: Food Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="E.g., 2 plates of Chowmein"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Describe the food and context..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="WhatsApp Number"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="For how many people?"
                      value={form.peopleCount}
                      onChange={(e) => setForm({ ...form, peopleCount: e.target.value })}
                    />
                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)}>Next <ArrowRight className="size-3" /></Button>

                    </div>
                  </div>
                )}

                {/* Step 2: Map + Images */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Location Toggle */}
                    <div className="flex gap-3">
                      <Button
                        variant={locationMode === "current" ? "default" : "outline"}
                        onClick={() => setLocationMode("current")}
                      >
                        📍 Current Location
                      </Button>
                      <Button
                        variant={locationMode === "manual" ? "default" : "outline"}
                        onClick={() => setLocationMode("manual")}
                      >
                        🗺️ Pick on Map
                      </Button>
                    </div>

                    {/* Map Display */}
                    <div className="h-[200px] overflow-hidden rounded-lg border shadow-inner">
                      <MapContainer
                        center={[form.lat, form.lng]}
                        zoom={15}
                        className="h-full w-full z-0"
                        key={`${form.lat}-${form.lng}`}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker />
                      </MapContainer>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium dark:bg-zinc-900  dark:border-zinc-700">
                        Upload up to 3 images
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={form.images.length >= 3}
                      />

                      {previews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {previews.map((src, idx) => (
                            <div
                              key={idx}
                              className="relative group rounded-lg overflow-hidden border dark:border-zinc-700 shadow"
                            >
                              <img
                                src={src}
                                alt={`Preview ${idx + 1}`}
                                className="object-cover h-24 w-full"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white text-xs rounded-full p-1 transition"
                              >
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="ml-2 size-4" />
                        Back
                      </Button>
                      <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Submit"
                        )}
                      </Button>

                    </div>
                  </div>
                )}
              </div>
            </div>



          </div>
        </div>
      </section>
    </>
  );
};


