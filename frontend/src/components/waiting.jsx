import React from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCircle,
  FaClock,
  FaStar,
  FaMotorcycle,
} from "react-icons/fa";

const WaitingForDriver = ({
  selectedVehicle,
  pickup,
  destination,
  setDriverFound,
}) => {
  const vehicleData = {
    car: {
      name: "TexiGo",
      number: "RJ 01 AB 4587",
      driver: "Rahul Sharma",
      otp: "3241",
      arriving: "2 mins away",
      rating: "4.9",
      trips: "324 Trips",
      image:
        "https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png",
    },

    motorcycle: {
      name: "motorcycle",
      number: "RJ 01 XY 2241",
      driver: "Aman Verma",
      otp: "1942",
      arriving: "1 min away",
      rating: "4.8",
      trips: "201 Trips",
      image:
        "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n",
    },

    auto: {
      name: "Auto",
      number: "RJ 01 CD 9011",
      driver: "Imran Khan",
      otp: "7621",
      arriving: "3 mins away",
      rating: "4.7",
      trips: "178 Trips",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYZNGPspo5yDiYR9DP05wsjLh1skE79Jfng&s",
    },
  };

  const currentVehicle = vehicleData[selectedVehicle] || vehicleData.car;

  return (
    <div className="w-full h-full bg-gradient-to-b from-white to-gray-100 rounded-t-[35px] px-4 py-4 shadow-2xl flex flex-col overflow-y-auto">

      {/* Main Content */}
      <div className="flex-1">

        {/* Heading */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Driver On The Way
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Your ride has been confirmed
            </p>
          </div>

          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
            <FaCircle className="text-green-500 text-[8px] animate-pulse" />

            <p className="text-xs font-semibold text-green-700">
              Live
            </p>
          </div>
        </div>

        {/* Driver Card */}
        <div className="bg-white rounded-3xl shadow-md p-3 border border-gray-100">

          <div className="flex justify-between items-center gap-3">

            {/* Left Side */}
            <div className="flex items-center gap-3">

              <div className="bg-gray-100 rounded-2xl p-2">
                <img
                  src={currentVehicle.image}
                  alt=""
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div>
                <h2 className="text-base font-bold leading-none">
                  {currentVehicle.driver}
                </h2>

                <p className="text-gray-500 text-xs mt-1">
                  {currentVehicle.name}
                </p>

                <h1 className="text-base font-black mt-2 tracking-wide">
                  {currentVehicle.number}
                </h1>
              </div>
            </div>

            {/* Arrival Box */}
            <div className="bg-amber-100 border border-amber-200 px-3 py-2 rounded-2xl flex flex-col items-center min-w-[85px]">
              <FaClock className="text-amber-700 text-sm mb-1" />

              <p className="text-[10px] text-gray-500">
                Arriving
              </p>

              <h2 className="text-xs font-bold text-center">
                {currentVehicle.arriving}
              </h2>
            </div>
          </div>

          {/* Driver Stats */}
          <div className="flex items-center justify-between mt-3 bg-gray-50 rounded-2xl px-3 py-2">

            <div className="flex items-center gap-2">
              <FaStar className="text-amber-400 text-sm" />

              <p className="font-bold text-xs">
                {currentVehicle.rating}
              </p>
            </div>

            <div className="h-4 w-[1px] bg-gray-300"></div>

            <p className="text-xs font-medium text-gray-600">
              {currentVehicle.trips}
            </p>

            <div className="h-4 w-[1px] bg-gray-300"></div>

            <p className="text-xs font-semibold text-green-600">
              Verified
            </p>
          </div>
        </div>

        {/* OTP Card */}
        <div className="w-full bg-black text-white rounded-3xl px-4 py-3 flex justify-between items-center mt-4 shadow-lg">

          <div>
            <p className="text-[11px] text-gray-300">
              Share OTP with Driver
            </p>

            <h1 className="text-2xl font-black tracking-[6px] mt-1">
              {currentVehicle.otp}
            </h1>
          </div>

          <div className="bg-white/10 px-3 py-2 rounded-2xl">
            <p className="text-[11px] text-gray-300">
              Secure Ride
            </p>
          </div>
        </div>

        {/* Ride Info */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 mt-4 shadow-sm">

          {/* Pickup */}
          <div className="flex items-start gap-3 p-3 border-b border-gray-100">

            <div className="bg-black rounded-full p-2 mt-1">
              <FaMapMarkerAlt className="text-white text-[10px]" />
            </div>

            <div className="overflow-hidden">
              <h3 className="text-[10px] text-gray-500 font-medium">
                Pickup Location
              </h3>

              <p className="font-semibold text-xs text-gray-900 break-words">
                {pickup}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3 p-3">

            <div className="bg-green-500 rounded-full p-2 mt-1">
              <FaMapMarkerAlt className="text-white text-[10px]" />
            </div>

            <div className="overflow-hidden">
              <h3 className="text-[10px] text-gray-500 font-medium">
                Destination
              </h3>

              <p className="font-semibold text-xs text-gray-900 break-words">
                {destination}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 mt-4 sticky bottom-0 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent pt-3 pb-1">

        <button className="flex-1 bg-black text-white py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg">
          <FaPhoneAlt className="text-sm" />
          Call Driver
        </button>

        <button onClick={
            () => setDriverFound(false)
          
        }
         className="px-5 bg-red-100 text-red-600 rounded-2xl text-sm font-bold">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WaitingForDriver;