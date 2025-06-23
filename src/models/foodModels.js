// models/Food.js
import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  contact: { type: String, required: true },
  peopleCount: { type: Number, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  postedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'expired', 'claimed', 'closed'],
    default: 'active',
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs
  },
  uid: { type: String, required: true },
  claimedBy: { type: String, default: null },
  claimedAt: { type: Date, default: null }, //claming Time 
  claimerLat: { type: Number, default: null },
  claimerLng: { type: Number, default: null },
  images: {
    type: [String], // 🔥 Array of Cloudinary image URLs
    required: true,
  }
});

export default mongoose.models.Food || mongoose.model('Food', FoodSchema);
