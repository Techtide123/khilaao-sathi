'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


export default function ProfilePage() {
  const [fbUser, setFbUser] = useState(null);        // Firebase auth user
  const [profile, setProfile] = useState(null);      // Your MongoDB profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const auth = getAuth(app);




  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)

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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 space-y-8">
      <Card className="shadow-xl border border-gray-200 dark:border-gray-800">
        <CardHeader className="flex flex-col lg:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="shrink-0">
            <img
              src="/user.png"
              alt="User Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>

          {/* Profile Details */}
          <div className="flex-1 w-full space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">📞 {profile.phone}</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-500 dark:text-gray-400 pt-2">
              <p>🕒 Last Login: <span className="font-medium">Jun 18, 2025</span></p>
              <p>📅 Created On: <span className="font-medium">Jan 12, 2024</span></p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            {/* Update Profile Dialog */}
            <Dialog open={openProfileModal} onOpenChange={setOpenProfileModal}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">Update Info</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Meadow Richardson" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="meadow@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+91 9876543210" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Write something..." />
                  </div>
                  <div className="text-right">
                    <Button onClick={() => setOpenProfileModal(false)}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={openPasswordModal} onOpenChange={setOpenPasswordModal}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">Change Password</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input type="password" id="current-password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input type="password" id="new-password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input type="password" id="confirm-password" />
                  </div>
                  <div className="text-right">
                    <Button onClick={() => setOpenPasswordModal(false)}>Update</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
