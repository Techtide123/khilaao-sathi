import React, { useEffect, useState } from 'react';

import { FiSearch } from 'react-icons/fi';

const Map = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                setError(err.message);
            }
        );
    }, []);
    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white">
            {/* Search Bar */}
            <div className="p-4">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                    <FiSearch className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Search food nearby..."
                        className="bg-transparent w-full outline-none text-sm text-gray-800"
                    />
                </div>
            </div>

            {/* Map Section */}
            <div className="relative flex-1 overflow-hidden rounded-t-xl shadow-inner mx-4 mb-4 border border-gray-100">
                {/* Placeholder Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fff7e8] to-[#fef4db] flex items-center justify-center text-[#b6985a] text-lg font-semibold tracking-wide">
                    Map View (Your map integration here)
                </div>

                {/* Show current location pin if available */}
                {currentPosition && (
                    <div
                        className="absolute z-10"
                        style={{
                            // For example: center pin horizontally & vertically inside div (fake positioning)
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <div className="bg-[#b6985a] text-white px-2 py-1 rounded-md shadow-md text-xs flex items-center space-x-1">
                            <span>📍</span>
                            <span>Your Location</span>
                        </div>
                    </div>
                )}

                {/* Show error if geolocation fails */}
                {error && (
                    <div className="absolute bottom-2 left-2 text-red-500 text-xs bg-white px-2 py-1 rounded shadow">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Map