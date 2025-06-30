import { NextResponse } from 'next/server';
import connect from '@/dbConfig/dbconfig';
import User from '@/models/userModels';

export async function GET(req) {
    try {
        await connect();

    
        const user = await User.find(); // if using Firebase UID

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}