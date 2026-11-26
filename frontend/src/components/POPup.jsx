
import React from "react";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const POPup = ({ ride, setridePOPup, confirmRide }) => {
  const passengerName = `${ride?.userId?.fullname?.firstname || ""} ${
    ride?.userId?.fullname?.lastname || ""
  }`.trim();

  return (
    <div
      className="
        w-full
        h-auto
        max-h-[90vh]
        md:max-h-[calc(100dvh-2.5rem)]
        overflow-y-auto
        overscroll-contain
        bg-white
        rounded-t-[32px]
        md:rounded-3xl
        px-4 py-5
        md:p-5
        shadow-[0_-10px_30px_rgba(0,0,0,0.12)]
        md:shadow-2xl
        border border-gray-100
        flex flex-col
        md:gap-1
      "
    >
      {/* MOBILE DRAG HANDLE */}
      <div className="md:hidden w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium">
            NEW RIDE REQUEST
          </p>

          <h1 className="text-3xl md:text-2xl font-bold text-[#111827] mt-1">
            ₹{ride?.fare ?? "--"}
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Estimated ride fare
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-red-50 border border-red-100 text-red-500 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <FaClock className="text-xs" />
              <p className="text-sm font-semibold">15s</p>
            </div>
          </div>

          <button
            onClick={() => setridePOPup(false)}
            className="hidden md:flex w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center text-gray-600"
            aria-label="Close ride request"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* PASSENGER INFORMATION */}
      <div className="mt-5 md:mt-4 bg-yellow-50 border border-yellow-100 rounded-2xl p-3 flex items-center gap-3">
        <img
          className="w-12 h-12 rounded-xl object-cover shrink-0"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"
          alt="Passenger"
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-[#111827] capitalize truncate">
            {passengerName || "Passenger"}
          </h2>

          <p className="text-xs text-gray-500 mt-1 truncate">
            {ride?.userId?.email || "Passenger"}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
          <FaUser />
          Passenger
        </div>
      </div>

      {/* PICKUP */}
      <div className="mt-5 md:mt-4">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">
          PICKUP LOCATION
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-3">
          <div className="bg-[#111827] p-2 rounded-lg shrink-0">
            <FaLocationArrow className="text-white text-xs" />
          </div>

          <h2 className="text-sm font-semibold text-[#111827] leading-5 min-w-0 break-words">
            {ride?.pickup || "Pickup location"}
          </h2>
        </div>
      </div>

      {/* DESTINATION */}
      <div className="mt-3">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">
          DESTINATION
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg shrink-0">
            <FaMapMarkerAlt className="text-[#111827] text-xs" />
          </div>

          <h2 className="text-sm font-semibold text-[#111827] leading-5 min-w-0 break-words">
            {ride?.destination || "Destination"}
          </h2>
        </div>
      </div>

      {/* RIDE DETAILS */}
      <div className="grid grid-cols-3 gap-2 mt-4 md:gap-3">
        <div className="bg-[#111827] rounded-xl py-3 text-center text-white min-w-0">
          <h1 className="text-sm font-bold">
            {ride?.distance ?? "--"} KM
          </h1>
          <p className="text-[10px] text-gray-400 mt-1">
            Distance
          </p>
        </div>

        <div className="bg-[#111827] rounded-xl py-3 text-center text-white min-w-0">
          <h1 className="text-sm font-bold">
            {ride?.duration ?? "--"} Min
          </h1>
          <p className="text-[10px] text-gray-400 mt-1">
            Ride Time
          </p>
        </div>

        <div className="bg-[#111827] rounded-xl py-3 text-center text-white min-w-0">
          <div className="flex items-center justify-center gap-1">
            <FaMoneyBillWave className="text-yellow-400 text-xs" />
            <h1 className="text-sm font-bold">Cash</h1>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Payment
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-5 pt-1 md:mt-4 md:gap-3">
        <button
          onClick={() => setridePOPup(false)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition"
        >
          Ignore
        </button>

        <button
          onClick={() => {
            setridePOPup(false);
            confirmRide(ride?._id);
          }}
          className="flex-1 bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] transition-all text-[#111827] py-3 rounded-xl font-bold text-sm shadow-md"
        >
          Accept Ride
        </button>
      </div>
    </div>
  );
};

export default POPup;
