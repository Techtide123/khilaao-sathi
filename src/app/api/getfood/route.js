// import connect from "@/dbConfig/dbconfig";
// import Food from "@/models/foodModels";
// import { NextResponse } from "next/server";

// export async function GET(req, res) {
//     try {
//         await connect();
//         const food = await Food.find({});
//         // console.log("This is food List", food);
        
//         // backend
//         return NextResponse.json({ foods: food }, { status: 200 });
        
//     } catch (error) {
//         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
// }


import connect from "@/dbConfig/dbconfig";
import Food from "@/models/foodModels";
import { NextResponse } from "next/server";

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(2); // last two digits
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year}:${hours}:${minutes}`;
}

export async function GET(req) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // active | inactive | all

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    let foods;

    if (filter === "active") {
      foods = await Food.find({ postedAt: { $gte: twoHoursAgo } }).sort({ postedAt: -1 });
    } else if (filter === "inactive") {
      foods = await Food.find({ postedAt: { $lt: twoHoursAgo } }).sort({ postedAt: -1 });
    } else {
      foods = await Food.find().sort({ postedAt: -1 });
    }

    // Format the date for each item
    const formattedFoods = foods.map(food => ({
      ...food._doc,
      postedAtFormatted: formatDate(food.postedAt),
    }));

    return NextResponse.json({ foods: formattedFoods }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching food data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
