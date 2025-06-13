'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";



// Fix Leaflet icon issue for SSR
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [locationMode, setLocationMode] = useState('current');
  const [form, setForm] = useState({
    title: '',
    description: '',
    contact: '',
    peopleCount: '',
    lat: null,
    lng: null,
    
  });
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  // Set current location
  useEffect(() => {
    if (locationMode === 'current') {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setForm((prev) => ({ ...prev, lat, lng }));
      });
    }
  }, [locationMode]);
  
  // if (user) {
  //   const uid = user.uid; // ✅ This is the UID you need
  //   console.log("User UID:", uid);
  // }


  function LocationPicker() {
    useMapEvents({
      click(e) {
        if (locationMode === 'manual') {
          setForm((prev) => ({
            ...prev,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          }));
        }
      },
    });
    return form.lat && form.lng ? (
      <Marker position={[form.lat, form.lng]} />
    ) : null;
  }

  const handleSubmit = async () => {
    if (!form.lat || !form.lng) {
      return alert('Please select a location');
    }

    try {
      const res = await fetch('/api/postfood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          peopleCount: parseInt(form.peopleCount),
          uid: user.uid
        }),
      });

      const data = await res.json();
      alert(data.message || 'Food posted successfully!');
      router.push('/dashboard');

      // Reset form
      setForm({
        title: '',
        description: '',
        contact: '',
        peopleCount: '',
        lat: null,
        lng: null,
      });
      setStep(1);

    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url(/loginbg.webp)" }}
      >
        <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-lg rounded-2xl max-w-md w-full mx-4 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-yellow-800">
            {step === 1 ? '🍽️ Food Details' : '📍 Choose Location'}
          </h2>

          {step === 1 ? (
            <>
              <input
                type="text"
                placeholder="e.g., 2 plates of Chowmein"
                className="w-full border border-yellow-400 bg-white/70  rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black pt-1 pb-1 pl-1 pr-1"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Describe the food and context..."
                className="w-full border border-yellow-400 bg-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black pt-1 pb-1 pl-1 pr-1"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="WhatsApp Number"
                className="w-full border border-yellow-400 bg-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black pt-1 pb-1 pl-1 pr-1"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="For how many people?"
                className="w-full border border-yellow-400 bg-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black pt-1 pb-1 pl-1 pr-1"
                value={form.peopleCount}
                onChange={(e) => setForm({ ...form, peopleCount: e.target.value })}
                required
              />
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white w-full py-3 rounded-lg transition font-semibold mt-2"
                onClick={() => setStep(2)}
              >
                Next ➡️ Choose Location
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center gap-4 mb-2">
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition ${locationMode === 'current'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}
                  onClick={() => setLocationMode('current')}
                >
                  📍 Current Location
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition ${locationMode === 'manual'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}
                  onClick={() => setLocationMode('manual')}
                >
                  🗺️ Pick on Map
                </button>
              </div>

              {form.lat && form.lng ? (
                <div className="h-[300px] rounded-xl overflow-hidden border border-yellow-300 shadow-inner">
                  <MapContainer
                    center={[form.lat, form.lng]}
                    zoom={15}
                    className="h-full w-full"
                    key={`${form.lat}-${form.lng}`}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker />
                  </MapContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center border border-yellow-200 rounded-xl text-gray-600 text-sm bg-white/50">
                  {locationMode === 'manual'
                    ? '🖱️ Tap on the map to select location'
                    : '📡 Detecting your current location...'}
                </div>
              )}

              <p className="text-sm text-yellow-800 text-center mt-2">
                {locationMode === 'manual'
                  ? 'Manually choose your location'
                  : 'Using GPS to auto-locate'}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-yellow-100 text-yellow-800 w-1/2 py-3 rounded-lg font-medium border border-yellow-300 hover:bg-yellow-200 transition"
                  onClick={() => setStep(1)}
                >
                  ⬅️ Back
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white w-1/2 py-3 rounded-lg font-semibold transition"
                  onClick={handleSubmit}
                >
                  ✅ Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>


    </>
  );
}
