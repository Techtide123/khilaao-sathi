import connect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels"; // your mongoose model
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();

    // Parse JSON body from request
    const data = await req.json();

    console.log(data);  // will log the parsed body data

  

    // Create new Food post in DB
    const newFood = new Food(data);
    await newFood.save();

    return NextResponse.json({ message: "Food post created", food: newFood }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
