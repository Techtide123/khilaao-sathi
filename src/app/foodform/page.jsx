'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';



// Dynamically import the actual form with map
const LocationSelector = dynamic(() => import('@/components/Foodform/FoodForm'), {
  ssr: false,
});

export default function FoodForm() {

  return (<>
    <LocationSelector />
  </>);
}
