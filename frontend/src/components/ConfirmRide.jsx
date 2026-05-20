import React from "react";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaLocationArrow,
} from "react-icons/fa";

const ConfirmRide = ({
  setConfirmRide,
  selectedVehicle,
  pickup,
  destination,
    setLookingForDriver
}) => {
  const vehicleData = {
    car: {
      name: "TexiGo",
      price: "₹193",
      image:
        "https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png",
    },

    moto: {
      name: "Moto",
      price: "₹89",
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n",
    },

    auto: {
      name: "Auto",
      price: "₹129",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYZNGPspo5yDiYR9DP05wsjLh1skE79Jfng&s",
    },
  };

  const currentVehicle = vehicleData[selectedVehicle];

  return (
    <div className="w-full h-full bg-white rounded-t-3xl px-5 py-4 shadow-2xl flex flex-col justify-between overflow-hidden">

      {/* Top Section */}
      <div>
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Confirm Ride
          </h1>

          <button
            onClick={() => setConfirmRide(false)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300"
          >
            ✕
          </button>
        </div>

        {/* Vehicle Image */}
        <div className="w-full flex justify-center -mt-2">
          <img
            src={currentVehicle.image}
            alt=""
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 -mt-2">

          {/* Pickup */}
          <div className="flex items-start gap-4 p-3 border-b border-gray-200">
            <FaLocationArrow className="text-black text-lg mt-1" />

            <div>
              <h3 className="text-xs text-gray-500 font-medium">
                Pickup Location
              </h3>

              <p className="text-sm font-semibold text-gray-900">
                {pickup || "Current Location"}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-3 border-b border-gray-200">
            <FaMapMarkerAlt className="text-black text-lg mt-1" />

            <div>
              <h3 className="text-xs text-gray-500 font-medium">
                Destination
              </h3>

              <p className="text-sm font-semibold text-gray-900">
                {destination || "Enter Destination"}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-4 p-3">
            <FaMoneyBillWave className="text-black text-lg mt-1" />

            <div>
              <h3 className="text-xs text-gray-500 font-medium">
                Cash Payment
              </h3>

              <p className="text-sm font-bold text-gray-900">
                {currentVehicle.price}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <button
        onClick={() => setLookingForDriver(true)}
        className="w-full mt-4 bg-green-500 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-green-600 transition-all duration-300">
        Confirm Booking
      </button>
    </div>
  );
};

export default ConfirmRide;