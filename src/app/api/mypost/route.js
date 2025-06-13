import { NextResponse } from "next/server";
import connect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels";


export async function GET(req) {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid");

        console.log("👉 UID received:", uid);

        if (!uid) {
            return NextResponse.json({ error: "UID is required" }, { status: 400 });
        }

        const myPosts = await Food.find({ uid: uid }).sort({ postedAt: -1 });
        console.log("✅ Found posts:", myPosts.length);

        return NextResponse.json(myPosts, { status: 200 });

    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
