import React from "react";
import {
  FaHome,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCircle,
  FaClock,
} from "react-icons/fa";

const Riding = ({
  pickup,
  destination,
  selectedVehicle,
  setRideStarted,
}) => {
  const vehicleData = {
    car: {
      name: "TexiGo",
      price: "₹193",
      time: "12 mins",
    },

    moto: {
      name: "Moto",
      price: "₹89",
      time: "8 mins",
    },

    auto: {
      name: "Auto",
      price: "₹129",
      time: "15 mins",
    },
  };

  const currentVehicle =
    vehicleData[selectedVehicle] || vehicleData.car;

  return (
    <div className="w-full h-screen relative overflow-hidden">

      {/* Background Map */}
      <img
        className="w-full h-full object-cover"
        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        alt=""
      />

      {/* Top Ride Status */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 backdrop-blur-md px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl">

        <FaCircle className="text-green-400 text-[10px] animate-pulse" />

        <p className="text-white text-sm font-semibold">
          Ride Started
        </p>
      </div>

      {/* Bottom Ride Panel */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-[35px] px-5 py-5 shadow-2xl z-10">

        {/* Vehicle Info */}
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentVehicle.name}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Enjoy your ride safely 🚖
            </p>
          </div>

          <div className="bg-black text-white px-4 py-2 rounded-2xl">
            <p className="text-xs text-gray-300">
              Total Fare
            </p>

            <h2 className="text-xl font-bold">
              {currentVehicle.price}
            </h2>
          </div>
        </div>

        {/* Time Card */}
        <div className="w-full bg-amber-100 border border-amber-200 rounded-3xl p-4 mt-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="bg-amber-200 p-3 rounded-2xl">
              <FaClock className="text-amber-700 text-lg" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Estimated Arrival Time
              </p>

              <h2 className="text-lg font-bold text-gray-900">
                {currentVehicle.time}
              </h2>
            </div>
          </div>

          <FaCircle className="text-green-500 text-[10px] animate-pulse" />
        </div>

        {/* Route Info */}
        <div className="bg-gray-50 rounded-3xl border border-gray-200 mt-5 overflow-hidden">

          {/* Pickup */}
          <div className="flex items-start gap-3 p-4 border-b border-gray-200">

            <div className="bg-black rounded-full p-2 mt-1">
              <FaMapMarkerAlt className="text-white text-xs" />
            </div>

            <div>
              <h3 className="text-xs text-gray-500">
                Pickup
              </h3>

              <p className="font-semibold text-sm text-gray-900 break-words">
                {pickup}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3 p-4">

            <div className="bg-green-500 rounded-full p-2 mt-1">
              <FaMapMarkerAlt className="text-white text-xs" />
            </div>

            <div>
              <h3 className="text-xs text-gray-500">
                Destination
              </h3>

              <p className="font-semibold text-sm text-gray-900 break-words">
                {destination}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">

          {/* Payment */}
          <button className="flex-1 bg-black text-white py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-3 shadow-lg hover:bg-gray-900 transition-all">

            <FaMoneyBillWave />

            Make Payment
          </button>

          {/* Home */}
          <button
            onClick={() => 
                navigation.navigate("/UserHome")
            }
            className="px-5 bg-gray-100 text-black rounded-2xl flex items-center justify-center text-lg hover:bg-gray-200 transition-all"
          >
            <FaHome />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;