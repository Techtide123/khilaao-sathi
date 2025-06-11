
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';



export default function FoodPage() {
  const [filter, setFilter] = useState('all');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchFood = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/getfood?filter=${filter}`);
      const data = await res.json();
      setFoods(data.foods || []);
    } catch (err) {
      console.error("Error fetching food:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFood();
  }, [filter]);

  return (
    // <div className="p-6 max-w-4xl mx-auto">
    //   {/* Filter Tabs */}
    //   <div className="flex gap-4 mb-6">
    //     {['all', 'active', 'inactive'].map((type) => (
    //       <button
    //         key={type}
    //         onClick={() => setFilter(type)}
    //         className={`px-4 py-2 rounded-full ${filter === type ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'
    //           }`}
    //       >
    //         {type.charAt(0).toUpperCase() + type.slice(1)}
    //       </button>
    //     ))}
    //   </div>

    //   {/* Content */}
    //   {loading ? (
    //     <p className="text-gray-500">Loading...</p>
    //   ) : foods.length === 0 ? (
    //     <p className="text-gray-500">No food items found.</p>
    //   ) : (
    //     <ul className="space-y-4">
    //       {foods.map((food) => (
    //         <li key={food._id} className="p-4 border rounded shadow">
    //           <Link href={`/fooddetails/${food._id}`}>
    //             <h3 className="text-lg font-semibold">{food.title}</h3>
    //             <p className="text-sm text-gray-500">
    //               Posted at: {food.postedAtFormatted || new Date(food.postedAt).toLocaleString()}
    //             </p>
    //             <p>{food.description}</p>
    //             <p className="text-sm">People Count: {food.peopleCount}</p>
    //             <p className="text-sm">Contact: {food.contact}</p>
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
    <>
      <div className="p-4 max-w-3xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-3 mb-5">
          {['all', 'active', 'inactive'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === type
                  ? 'bg-[#b6985a] text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Food Cards */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : foods.length === 0 ? (
          <p className="text-gray-500">No food items found.</p>
        ) : (
          <ul className="space-y-3">
            {foods.map((food) => (
              <li
                key={food._id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <Link
                  href={`/fooddetails/${food._id}`}
                  className="flex items-center gap-4 p-3"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-md overflow-hidden border">
                    <img
                      src={food.images?.[0] || '/placeholder.jpg'}
                      alt={food.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#b6985a] line-clamp-1">
                      {food.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 gap-2 mt-1">
                      <FaUser className="text-gray-400 text-xs" />
                      <span className="line-clamp-1">
                        {food.username || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>


    </>
  );
}


