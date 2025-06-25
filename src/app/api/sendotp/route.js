import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { redis } from "@/lib/redis";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(email, otp, { ex: 300 }); // expires in 5 mins

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // <-- This is critical for your error
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Signup",
      text: `Your OTP is ${otp}`,
    });

    return NextResponse.json({ message: "OTP sent" });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
