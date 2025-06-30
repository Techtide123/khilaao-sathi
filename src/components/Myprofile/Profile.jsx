'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const [fbUser, setFbUser] = useState(null);        // Firebase auth user
  const [profile, setProfile] = useState(null);      // Your MongoDB profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const auth = getAuth(app);




  const [openProfileModal, setOpenProfileModal] = useState(false)

  const router = useRouter();

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




  // Loader Effcts starts here
  if (loading) {
    return (<div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md animate-pulse">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
      </div>
      <p className="text-base text-gray-600 dark:text-gray-400">Loading your profile…</p>
    </div>);
  }
  if (!fbUser) {
    return <p className="text-center mt-10 text-red-500">You must be signed in to view this page.</p>;
  }



  // Pull fields from Firebase user...
  const { displayName, email, phoneNumber, photoURL, metadata, uid } = fbUser;


  // Update Information function 
  const updateInfo = async (e) => {
    e.preventDefault();

    // 3) Update your extended profile on your API
    try {
      const res = await fetch(`/api/cuserinfo/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: e.target.name.value,
          phone: e.target.phone.value,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const { user } = await res.json();
      setProfile(user); // update UI with new values
      toast.success("Profile updated!");
      setOpenProfileModal(false); // close modal

    } catch (err) {
      toast.error("Update failed: " + err.message);
    }
  }






  return (
    <div className="relative">
      {/* Curved Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 md:h-60 bg-gradient-to-br from-purple-600 via-indigo-500 to-fuchsia-500 rounded-b-[100px] z-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 space-y-8">
        <Card className="shadow-xl border border-gray-200 dark:border-gray-800  md:h-60 md:flex justify-center">
          <CardHeader className="flex flex-col lg:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="shrink-0 bg-gradient-to-br from-[#facc15] via-[#fbbf24] to-[#f97316] p-[3px] rounded-full shadow-lg">
              <div className="bg-white dark:bg-gray-900 p-1 rounded-full">
                <img
                  src="/user.png"
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover aspect-square"
                />
              </div>
            </div>


            {/* Profile Details */}
            <div className="flex-1 w-full text-center lg:text-left space-y-2">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-lg">📧</span> <span>{email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg">📞</span> <span>{profile.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  🕒 <span>Last Login:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(metadata.lastSignInTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  📅 <span>Created On:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(metadata.creationTime).toLocaleString()}</span>
                </div>
              </div>
            </div>


            {/* Buttons */}
            <div className="flex flex-row sm:flex-row gap-4 mt-4 lg:mt-0">
              {/* Update Profile Dialog */}
              <Dialog open={openProfileModal} onOpenChange={setOpenProfileModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-20vw sm:w-auto">Update Info</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>

                  {/* ✅ Wrap fields in a form */}
                  <form onSubmit={updateInfo} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" defaultValue={profile.name} />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" defaultValue={profile.phone} />
                    </div>

                    <div className="text-right">
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </DialogContent>



              </Dialog>


              {/* Change Password Dialog */}
              <Button className="sm:max-w-md" onClick={() => router.push('/reset')}>
                Change Password
              </Button>

            </div>
          </CardHeader>
        </Card>
      </div>
      <ToastContainer position="top-center" />
    </div>
  )
}
