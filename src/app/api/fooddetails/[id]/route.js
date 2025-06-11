import connect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    await connect();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const food = await Food.findById(id);

    if (!food) {
        return NextResponse.json({ error: "Food item not found" }, { status: 404 });
    }

    const date = new Date(food.postedAt);
    const postedAtFormatted = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear().toString().slice(2)}:${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

    return NextResponse.json({ food: { ...food._doc, postedAtFormatted } }, { status: 200 });
}
