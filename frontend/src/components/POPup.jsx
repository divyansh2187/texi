import React from "react";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

const POPup = ({ setridePOPup , setConfirmRidePanel }) => {
  return (
    <div className="w-full h-full bg-white rounded-t-[32px] px-4 pt-4 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] flex flex-col">

      {/* Top Line */}
      <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-gray-500">
            New Ride Request
          </p>

          <h1 className="text-2xl font-bold text-[#111827] mt-1">
            ₹193
          </h1>
        </div>

        {/* Time */}
        <div className="bg-red-100 text-red-500 px-3 py-2 rounded-2xl">

          <div className="flex items-center gap-2">
            <FaClock className="text-xs" />

            <p className="text-sm font-semibold">
              15s
            </p>
          </div>
        </div>
      </div>

      {/* Rider Info */}
      <div className="mt-5 bg-yellow-50 border border-yellow-100 rounded-3xl p-3 flex items-center gap-3">

        {/* User Img */}
        <img
          className="w-14 h-14 rounded-2xl object-cover"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"
          alt=""
        />

        {/* User Details */}
        <div className="flex-1">

          <div className="flex items-center justify-between">

            <h2 className="text-base font-bold text-[#111827]">
              Rahul Sharma
            </h2>

            <p className="text-xs text-gray-500">
              2 mins away
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Looking for a quick ride
          </p>
        </div>
      </div>

      {/* Pickup */}
      <div className="mt-4">

        <p className="text-[11px] text-gray-500 mb-2">
          PICKUP
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-start gap-3">

          <div className="bg-[#111827] p-2 rounded-xl mt-1">
            <FaLocationArrow className="text-white text-xs" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#111827]">
              Ajmer Railway Station
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Civil Lines Ajmer Rajasthan
            </p>
          </div>
        </div>
      </div>

      {/* Destination */}
      <div className="mt-3">

        <p className="text-[11px] text-gray-500 mb-2">
          DESTINATION
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-start gap-3">

          <div className="bg-yellow-400 p-2 rounded-xl mt-1">
            <FaMapMarkerAlt className="text-[#111827] text-xs" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#111827]">
              Ana Sagar Lake
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Near Daulat Bagh Ajmer
            </p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="grid grid-cols-3 gap-2 mt-4">

        {/* Distance */}
        <div className="bg-[#111827] rounded-2xl py-3 text-center text-white">

          <h1 className="text-sm font-bold">
            4.2 KM
          </h1>

          <p className="text-[10px] text-gray-400 mt-1">
            Distance
          </p>
        </div>

        {/* Time */}
        <div className="bg-[#111827] rounded-2xl py-3 text-center text-white">

          <h1 className="text-sm font-bold">
            12 Min
          </h1>

          <p className="text-[10px] text-gray-400 mt-1">
            Ride Time
          </p>
        </div>

        {/* Payment */}
        <div className="bg-[#111827] rounded-2xl py-3 text-center text-white">

          <div className="flex items-center justify-center gap-1">
            <FaMoneyBillWave className="text-yellow-400 text-xs" />

            <h1 className="text-sm font-bold">
              Cash
            </h1>
          </div>

          <p className="text-[10px] text-gray-400 mt-1">
            Payment
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-auto pb-4 pt-5">

        {/* Decline */}
        <button onClick={() => setridePOPup(false)}
         className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold">
          Ignore
        </button>

        {/* Accept */}
        <button onClick={() => {
             setConfirmRidePanel(true)
        }} className="flex-1 bg-yellow-400 hover:bg-yellow-300 transition-all text-[#111827] py-3 rounded-2xl font-bold shadow-lg">
          Accept Ride
        </button>
      </div>
    </div>
  );
};

export default POPup;