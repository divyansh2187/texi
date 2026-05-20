import React from "react";
import { FaSpinner } from "react-icons/fa";

const LookingForDriver = ({
  selectedVehicle,
  setLookingForDriver,
}) => {
  const vehicleData = {
    car: {
      name: "TexiGo",
      image:
        "https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png",
    },

    moto: {
      name: "Moto",
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n",
    },

    auto: {
      name: "Auto",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYZNGPspo5yDiYR9DP05wsjLh1skE79Jfng&s",
    },
  };

  const currentVehicle = vehicleData[selectedVehicle];

  return (
    <div className="w-full h-full bg-white rounded-t-3xl px-5 py-6 shadow-2xl flex flex-col justify-between">

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">

        {/* Vehicle */}
        <img
          src={currentVehicle.image}
          alt=""
          className="w-40 h-40 object-contain"
        />

        {/* Loader */}
        <div className="mt-4">
          <FaSpinner className="text-4xl animate-spin text-black" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold mt-6 text-center">
          Looking for a Driver
        </h1>

        <p className="text-gray-500 text-center mt-2 px-4">
          Please wait while we connect you with a nearby driver...
        </p>
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => setLookingForDriver(false)}
        className="w-full bg-red-500 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-red-600 transition-all duration-300"
      >
        Cancel Ride
      </button>
    </div>
  );
};

export default LookingForDriver;