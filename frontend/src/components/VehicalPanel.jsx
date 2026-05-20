import React from "react";
import { FaUser, FaTimes } from "react-icons/fa";

const VehiclePanel = ({
  vehicalpanelref,
  setvehicalpanel,
  selectedVehicle,
  setSelectedVehicle,
  confirmRide,
  setConfirmRide
}) => {
  return (
    <div
      ref={vehicalpanelref}
      className="w-full fixed bottom-0 left-0  bg-white rounded-t-3xl px-3 py-6 shadow-2xl translate-y-full"
    >
      {/* Top Area */}
      <div className="relative mb-6 bg-amber-200 flex justify-between items-center px-5 py-4 rounded-2xl">

        <h1 className="text-2xl font-bold text-gray-900">
          Choose A Vehicle
        </h1>

        <button
          onClick={() => setvehicalpanel(false)
            
          }
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      {/* Vehicle List */}
      <div className="flex flex-col gap-4">

        {/* Car */}
        <div
          onClick={() => {
            setSelectedVehicle("car");
             setConfirmRide(true);
          }}
          className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-white cursor-pointer transition-all duration-200
          ${
            selectedVehicle === "car"
              ? "border-2 border-amber-300 shadow-lg scale-[1.01]"
              : "border border-gray-200 hover:border-black hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">

            <img
              src="https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png"
              alt="TexiGo"
              className="h-16 w-16 object-contain"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  TexiGo
                </h2>

                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                  <FaUser className="text-[10px]" />
                  4
                </span>
              </div>

              <p className="text-sm font-medium text-gray-700 mt-1">
                2 mins away
              </p>

              <p className="text-xs text-gray-500">
                Affordable, compact rides
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            ₹193
          </h3>
        </div>

        {/* Moto */}
        <div
          onClick={() => {
            setSelectedVehicle("moto");
               setConfirmRide(true);
          }}
          className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-white cursor-pointer transition-all duration-200
          ${
            selectedVehicle === "moto"
              ? "border-2 border-amber-300 shadow-lg scale-[1.01]"
              : "border border-gray-200 hover:border-black hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">

            <img
              src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n"
              alt="Moto"
              className="h-14 w-14 object-contain"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Moto
                </h2>

                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                  <FaUser className="text-[10px]" />
                  1
                </span>
              </div>

              <p className="text-sm font-medium text-gray-700 mt-1">
                1 min away
              </p>

              <p className="text-xs text-gray-500">
                Quick & affordable bike rides
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            ₹89
          </h3>
        </div>

        {/* Auto */}
        <div
          onClick={() => {
            setSelectedVehicle("auto");
            setConfirmRide(true);
          }}
          className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-white cursor-pointer transition-all duration-200
          ${
            selectedVehicle === "auto"
              ? "border-2 border-amber-300 shadow-lg scale-[1.01]"
              : "border border-gray-200 hover:border-black hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">

            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYZNGPspo5yDiYR9DP05wsjLh1skE79Jfng&s"
              alt="Auto"
              className="h-12 w-12 object-contain"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Auto
                </h2>

                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                  <FaUser className="text-[10px]" />
                  3
                </span>
              </div>

              <p className="text-sm font-medium text-gray-700 mt-1">
                3 mins away
              </p>

              <p className="text-xs text-gray-500">
                Budget-friendly everyday rides
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900">
            ₹129
          </h3>
        </div>
      </div>
    </div>
  );
};

export default VehiclePanel;