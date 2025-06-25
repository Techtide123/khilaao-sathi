import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();



    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    const storedOtp = await redis.get(email);



    if (storedOtp?.toString().trim() === otp?.toString().trim()) {
      await redis.del(email); // Optional: clear the OTP after verification
      return NextResponse.json({ success: true, message: "OTP verified successfully" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 401 });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ message: "Server error while verifying OTP" }, { status: 500 });
  }
}
