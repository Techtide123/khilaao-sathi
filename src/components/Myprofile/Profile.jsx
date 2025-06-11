'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';

export default function ProfilePage() {
  const [fbUser, setFbUser] = useState(null);        // Firebase auth user
  const [profile, setProfile] = useState(null);      // Your MongoDB profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const auth = getAuth(app);

  // 1) Listen for Firebase login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setFbUser(null);
        setLoading(false);
        return;
      }

      setFbUser(currentUser);

      // 2) Fetch your extended profile from your API
      try {
        const res = await fetch(`/api/cuserinfo/${currentUser.uid}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { user: dbUser } = await res.json();
        console.log(dbUser.name);
        setProfile(dbUser);
      } catch (e) {
        console.error('Error fetching profile:', e);
        setError('Could not load profile data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading profile…</p>;
  }
  if (!fbUser) {
    return <p className="text-center mt-10 text-red-500">You must be signed in to view this page.</p>;
  }

  // Pull fields from Firebase user...
  const { displayName, email, phoneNumber, photoURL, metadata, uid } = fbUser;

  return (
    <>

      <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-xl p-6 max-w-md mx-auto mt-10">
        <div className="flex flex-col items-center text-center">
          <img
            src={photoURL || '/user.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{profile.name || 'Unnamed User'}</h2>
          <p className="text-gray-500 text-sm">{email}</p>
          <p className="text-gray-700 mt-4"><strong>Phone :</strong> {profile.phone}</p>
        </div>

        {/* MongoDB Profile Details */}
        {profile && (
          <div className="mt-2 bg-white rounded-xl shadow-inner p-4 space-y-2">

            {/* Add more fields here if needed */}
          </div>
        )}

        {/* Firebase Metadata */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
          <button className="bg-[#b6985a] hover:bg-yellow-700 text-white py-1.5 px-3 text-sm rounded-lg shadow transition">
            <strong>Last Login:</strong><br />
            <span className="text-xs font-light">{new Date(metadata.lastSignInTime).toLocaleString()}</span>
          </button>
          <button className="bg-[#b6985a] hover:bg-yellow-700 text-white py-1.5 px-3 text-sm rounded-lg shadow transition">
            <strong>Created On:</strong><br />
            <span className="text-xs font-light">{new Date(metadata.creationTime).toLocaleString()}</span>
          </button>
        </div>

        {/* UID and Error */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p><strong>UID:</strong> <span className="break-all">{uid}</span></p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

      </div>

    </>
  );
}
