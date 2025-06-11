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
