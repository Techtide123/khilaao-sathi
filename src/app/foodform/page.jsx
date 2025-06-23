'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Header/Navbar'
import { Footer } from '@/components/Footer/Footer';
// Dynamically import the actual form with map
const LocationSelector = dynamic(() => import('@/components/Foodform/FoodForm'), {
  ssr: false,
});

export default function FoodForm() {
  return (<>
    <Navbar />
    <LocationSelector />
    <Footer />
  </>);
}
