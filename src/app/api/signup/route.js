import connect from "@/dbConfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connect();
        const data = await req.json();
        console.log(data); // will log the parsed body data
        const user = await User.create(data);
        return NextResponse.json({ message: "User created", user }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}