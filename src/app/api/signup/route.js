import connect from "@/dbConfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Buffer } from "buffer";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connect();

        const formData = await req.formData();

        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const phone = formData.get("phone");
        const uid = formData.get("uid");
        const image = formData.get("image");

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Upload image to Cloudinary
        let profileImageUrl = "";
        if (image && typeof image === "object") {
            const buffer = Buffer.from(await image.arrayBuffer());
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "profile-images" }, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    })
                    .end(buffer);
            });
            profileImageUrl = uploadResult.secure_url;
        }

        // ✅ Store user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            uid,
            profileImage: profileImageUrl,
        });

        return NextResponse.json({ message: "User created", user }, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}






