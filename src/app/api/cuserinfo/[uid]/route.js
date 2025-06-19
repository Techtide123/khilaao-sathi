import { NextResponse } from 'next/server';
import connect from '@/dbConfig/dbconfig';
import User from '@/models/userModels';

export async function GET(request, { params }) {
    try {
        await connect();

        const { uid } = await params; // ✅ FIX: get UID from the params object

        const user = await User.findOne({ uid }); // if using Firebase UID

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}



export async function PUT(request, { params }) {
    try {
        await connect();

        const { uid } = await params; // ✅ Fixed: direct destructure

        const user = await User.findOne({ uid });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const data = await request.json();
        const updatedUser = await User.findOneAndUpdate({ uid }, data, { new: true });

        return NextResponse.json({ user: updatedUser }, { status: 200 }); // ✅ return updated user
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
