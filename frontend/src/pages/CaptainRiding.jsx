import React, { useState } from "react";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CaptainRiding = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">

      {/* Map */}
      <img
        className="w-full h-full object-cover"
        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        alt=""
      />

      {/* Top Overlay */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full">
        <h1 className="text-white font-semibold text-sm tracking-wide">
          Ride in Progress
        </h1>
      </div>

      {/* Bottom Panel */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-[35px] px-5 shadow-2xl transition-all duration-300 overflow-hidden ${
          showDetails ? "h-fit py-5" : "h-fit py-4"
        }`}
      >

        {/* Top Row */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              4 KM
            </h1>

            <p className="text-gray-500 text-sm">
              Away from destination
            </p>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-2xl shadow-lg"
          >
            <MdKeyboardArrowUp
              className={`transition-all duration-300 ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Small Mode */}
        {!showDetails && (
          <button className="w-full mt-4 bg-green-500 text-white py-3 rounded-2xl font-bold shadow-md">
            Complete Ride
          </button>
        )}

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-6">

            {/* Passenger Card */}
            <div className="flex items-center justify-between bg-gray-100 rounded-3xl p-4">

              <div className="flex items-center gap-3">

                <img
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt=""
                />

                <div>
                  <h2 className="font-bold text-lg">
                    Tanu Sharma
                  </h2>

                  <p className="text-sm text-gray-500">
                    Passenger
                  </p>
                </div>
              </div>
            </div>

            {/* Ride Info */}
            <div className="mt-5 flex flex-col gap-4">

              {/* Pickup */}
              <div className="flex items-start gap-4">

                <div className="bg-green-100 p-3 rounded-full">
                  <FaLocationArrow className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pickup
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Ana Sagar Lake Ajmer Rajasthan
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start gap-4">

                <div className="bg-red-100 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-red-500" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Destination
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Mayo College Road Ajmer Rajasthan
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">

              {/* Distance */}
              <div className="bg-gray-100 rounded-2xl p-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  4 KM
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Distance
                </p>
              </div>

              {/* Time */}
              <div className="bg-gray-100 rounded-2xl p-4 text-center">

                <div className="flex justify-center mb-1">
                  <FaClock className="text-gray-700" />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  8 Min
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Time
                </p>
              </div>

              {/* Fare */}
              <div className="bg-gray-100 rounded-2xl p-4 text-center">

                <div className="flex justify-center mb-1">
                  <FaMoneyBillWave className="text-green-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  ₹193
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Fare
                </p>
              </div>
            </div>

            {/* Confirmation Check */}
            <div className="mt-5 bg-gray-100 rounded-2xl p-4 flex items-center justify-between border border-gray-200">

              <div>
                <h2 className="font-semibold text-gray-900">
                  Confirm Ride Completion
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Passenger safely reached destination
                </p>
              </div>

              <label className="relative flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  checked={rideCompleted}
                  onChange={() =>
                    setRideCompleted(!rideCompleted)
                  }
                  className="sr-only"
                />

                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    rideCompleted
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400 bg-white"
                  }`}
                >
                  {rideCompleted && (
                    <span className="text-white text-sm font-bold">
                      ✓
                    </span>
                  )}
                </div>
              </label>
            </div>

            {/* Complete Ride Button */}
            <button
              disabled={!rideCompleted}
              onClick={() => {
                if (rideCompleted) {
                  navigate("/CaptainHome");
                }
              }}
              className={`w-full mt-6 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 ${
                rideCompleted
                  ? "bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {rideCompleted
                ? "Complete Ride"
                : "Confirm Completion First"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainRiding;