'use client';
import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig'; // Make sure you import your Firebase app correctly

const Mypost = () => {
    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const res = await fetch(`/api/mypost?uid=${user.uid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    console.log("✅ My posts data:", data);
                } catch (err) {
                    console.error("❌ Error fetching my posts:", err);
                }
            } else {
                console.log("⚠️ No user is signed in.");
            }
        });

        return () => unsubscribe(); // cleanup
    }, []);

    return (
        <>
            <h1>Mypost</h1>
        </>
    );
};

export default Mypost;
