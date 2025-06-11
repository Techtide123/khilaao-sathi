'use client';

import dynamic from 'next/dynamic';

// Dynamically import the actual form with map
const LocationSelector = dynamic(() => import('@/components/Foodform/FoodForm'), {
  ssr: false,
});

export default function FoodForm() {
  return <LocationSelector />;
}
