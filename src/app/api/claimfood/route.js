import dbConnect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { foodId, uid, claimerLat, claimerLng } = await req.json();

    if (!foodId || !uid || !claimerLat || !claimerLng) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const food = await Food.findById(foodId); // ✅ correct usage

    if (!food) {
      return NextResponse.json({ message: "Food not found" }, { status: 404 });
    }

    if (food.status !== 'active') {
      return NextResponse.json({ message: `Cannot claim. Current status is: ${food.status}` }, { status: 400 });
    }

    food.status = 'claimed';
    food.claimedBy = uid;
    food.claimedAt = new Date();
    food.claimerLat = claimerLat;
    food.claimerLng = claimerLng;

    await food.save();
    console.log("✅ Food successfully claimed! with the coordinates:", claimerLat, claimerLng);
    return NextResponse.json({ message: "Food successfully claimed!" }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
