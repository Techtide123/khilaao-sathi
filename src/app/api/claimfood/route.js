import dbConnect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { foodId, uid } = await req.json();

    if (!foodId || !uid) {
      return NextResponse.json({ message: "Missing foodId or uid" }, { status: 400 });
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

    await food.save();

    return NextResponse.json({ message: "Food successfully claimed!" }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
