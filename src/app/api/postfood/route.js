import connect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels"; // your mongoose model
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
// ✅ Your OneSignal Keys
const ONE_SIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY; // Move to env file for security

export async function POST(req) {
  try {
    await connect();


    const formData = await req.formData();  // 📦 2. Read multipart form data (includes fields + images)

    const fields = Object.fromEntries(formData.entries()); // 🧾 3. Convert form fields into a plain object

    const files = formData.getAll("images"); // 🖼️ 4. Extract all uploaded files (should be 3 max)

    const uploadedImages = []; // 🧺 5. Store uploaded Cloudinary URLs here

    // 🔄 6. Loop through and upload each image to Cloudinary
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer

      // Upload via Cloudinary stream
      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "food-donations" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      uploadedImages.push(uploaded.secure_url); // 📎 Add uploaded image URL to list
    }

    // 🧱 7. Prepare full data to store in MongoDB
    const foodData = {
      title: fields.title,
      description: fields.description,
      contact: fields.contact,
      peopleCount: Number(fields.peopleCount),
      lat: Number(fields.lat),
      lng: Number(fields.lng),
      uid: fields.uid, // 👤 User who posted
      images: uploadedImages, // 🖼️ Uploaded image URLs
      price: Number(fields.price)
    };





 // 📝 8. Save to MongoDB using Mongoose
    const newFood = new Food(foodData);
    await newFood.save();
    console.log("✅ Food post created:", newFood);

    // ✅ Send Push Notification via OneSignal
    const onesignalRes = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: ONE_SIGNAL_APP_ID,
        included_segments: ["All"], // Sends to all subscribed users
        headings: { en: "🍱 New Food Posted!" },
        contents: { en: `${foodData.title} is now available. Come and claim it in ${foodData.price}!` },
        url: "https://khilaao-sathi.vercel.app" // Replace with your actual frontend URL
      }),
    });

    const result = await onesignalRes.json();
    console.log("OneSignal Result:", result);




    return NextResponse.json({ message: "Food post created", food: newFood }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
