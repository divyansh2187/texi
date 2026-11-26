
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
  rideEstimate,
  setLookingForDriver,
  handleCreateRide,
  setvehicalpanel,
}) => {
  const vehicleData = {
    car: {
      name: "TexiGo",
      price: `₹${rideEstimate?.data?.fare?.car ?? "--"}`,
      image:
        "https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png",
    },

    motorcycle: {
      name: "Motorcycle",
      price: `₹${rideEstimate?.data?.fare?.motorcycle ?? "--"}`,
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n",
    },

    auto: {
      name: "Auto",
      price: `₹${rideEstimate?.data?.fare?.auto ?? "--"}`,
      image:
        "https://tb-static.uber.com/prod/udam-assets/4e718d5c-e431-59c5-acb5-ac40c26c24df.webp",
    },
  };

  const currentVehicle = vehicleData[selectedVehicle] || vehicleData.car;

  return (
    <div className="w-full h-full bg-white rounded-t-3xl px-5 py-4 shadow-2xl flex flex-col justify-between overflow-hidden md:rounded-2xl md:px-4 md:py-4 md:shadow-none">

      <div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 md:text-xl">
            Confirm Ride
          </h1>

          <button
            onClick={() => {
              setConfirmRide(false);
              setvehicalpanel(true);
            }}
            aria-label="Close confirmation"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 md:w-9 md:h-9"
          >
            ✕
          </button>
        </div>

        {/* Vehicle Image */}
        <div className="w-full flex justify-center -mt-2 md:mt-0">
          {currentVehicle && (
            <img
              src={currentVehicle.image}
              alt={currentVehicle.name}
              className="w-32 h-32 object-contain md:w-36 md:h-36"
            />
          )}
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 -mt-2 md:mt-0 md:rounded-2xl">

          {/* Pickup */}
          <div className="flex items-start gap-4 p-3 border-b border-gray-200">
            <FaLocationArrow className="text-black text-lg mt-1 shrink-0" />

            <div className="min-w-0">
              <h3 className="text-xs text-gray-500 font-medium">
                Pickup Location
              </h3>

              <p className="text-sm font-semibold text-gray-900 break-words">
                {pickup || "Current Location"}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4 p-3 border-b border-gray-200">
            <FaMapMarkerAlt className="text-black text-lg mt-1 shrink-0" />

            <div className="min-w-0">
              <h3 className="text-xs text-gray-500 font-medium">
                Destination
              </h3>

              <p className="text-sm font-semibold text-gray-900 break-words">
                {destination || "Enter Destination"}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-4 p-3">
            <FaMoneyBillWave className="text-black text-lg mt-1 shrink-0" />

            <div>
              <h3 className="text-xs text-gray-500 font-medium">
                Cash Payment
              </h3>

              <p className="text-sm font-bold text-gray-900">
                {currentVehicle?.price}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={() => {
          setLookingForDriver(true);
          handleCreateRide();
        }}
        className="w-full mt-4 bg-green-500 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-green-600 transition-all duration-300 md:py-3 md:text-base"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default ConfirmRide;
