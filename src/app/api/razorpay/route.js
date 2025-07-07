
import Razorpay from 'razorpay'

export async function POST(req) {
    const body = await req.json();

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID, // ✅ Corrected spelling
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });


    const options = {
        amount: body.amount * 100, // in paise (e.g. 500 means ₹5)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        return Response.json(order);
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
