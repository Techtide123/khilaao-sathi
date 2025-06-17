import connect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels"; // your mongoose model
import { NextResponse } from "next/server";

// ✅ Your OneSignal Keys
const ONE_SIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.ONE_SIGNAL_API_KEY; // Move to env file for security

export async function POST(req) {
  try {
    await connect();

    // Parse JSON body from request
    const data = await req.json();
    const { title } = data;


    console.log(data);  // will log the parsed body data



    // Create new Food post in DB
    const newFood = new Food(data);
    await newFood.save();

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
        contents: { en: `${title} is now available. Come and claim it!` },
        url: "http://localhost:3000" // Replace with your actual frontend URL
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
