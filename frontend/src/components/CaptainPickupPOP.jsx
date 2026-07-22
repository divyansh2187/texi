import React, { useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CaptainPickupPOP = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const x = useMotionValue(0);

  const handleRideStart = () => {
    if (otp.length !== 4) {
      alert("Please enter valid OTP");

      animate(x, 0, {
        type: "spring",
        stiffness: 300,
      });

      return;
    }

    navigate("/captain-riding");
  };

  return (
    <div className="w-full h-full bg-white rounded-t-[30px] px-4 pt-4 pb-5 shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">

      {/* Top Line */}
      <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto"></div>

      {/* Heading */}
      <div className="mt-3 text-center">
        <h1 className="text-2xl font-bold text-[#111827]">
          Arrived at Pickup
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Verify passenger OTP to start the ride
        </p>
      </div>

      {/* Passenger */}
      <div className="mt-6 flex items-center justify-between bg-gray-100 rounded-2xl p-4">

        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt=""
            className="w-14 h-14 rounded-full object-cover"
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

        <div className="text-right">
          <h3 className="font-bold text-lg">
            ₹193
          </h3>

          <p className="text-xs text-gray-500">
            Fare
          </p>
        </div>

      </div>

      {/* OTP */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5"
      >
        <label className="text-sm font-semibold text-gray-700">
          Enter Ride OTP
        </label>

        <input
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4 digit OTP"
          className="w-full mt-2 bg-gray-100 border-2 border-transparent focus:border-green-500 outline-none rounded-2xl px-4 py-4 text-lg font-semibold tracking-[6px]"
        />

        {/* Swipe */}
        <div className="mt-6 relative w-full h-14 bg-[#111827] rounded-full overflow-hidden">

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-semibold text-white">
              Swipe to Start Ride
            </p>
          </div>

          <motion.div
            drag="x"
            style={{ x }}
            dragConstraints={{ left: 0, right: 260 }}
            whileTap={{ scale: 1.05 }}
            onDragEnd={(event, info) => {
              if (info.offset.x > 180) {
                handleRideStart();
              } else {
                animate(x, 0, {
                  type: "spring",
                  stiffness: 300,
                });
              }
            }}
            className="absolute left-1 top-1 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-[#111827] text-xl font-bold cursor-pointer shadow-lg"
          >
            →
          </motion.div>
        </div>
      </form>

      {/* Cancel */}
      <button
        onClick={() => navigate("/captain-home")}
        className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default CaptainPickupPOP;