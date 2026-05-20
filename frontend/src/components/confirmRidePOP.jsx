import React, { useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ConfirmRidePOP = ({
  setridePOPup,
  setConfirmRidePanel,
}) => {
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

    navigate("/captain-Riding");
  };

  return (
    <div className="w-full h-full bg-white rounded-t-[30px] px-4 pt-4 pb-5 shadow-[0_-10px_30px_rgba(0,0,0,0.12)]">

      {/* Top Line */}
      <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto"></div>

      {/* Heading */}
      <div className="mt-3 text-center">

        <h1 className="text-2xl font-bold text-[#111827]">
          Start Ride
        </h1>

      </div>

      {/* Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-5"
      >

        {/* OTP Input */}
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

        {/* Swipe Bar */}
        <div className="mt-6 relative w-full h-14 bg-[#111827] rounded-full overflow-hidden">

          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center">

            <p className="text-sm font-semibold text-white">
              Swipe to Start Ride
            </p>
          </div>

          {/* Swipe Button */}
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
        onClick={() => {
          setridePOPup(false);
          setConfirmRidePanel(false);
        }}
        className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold"
      >
        Cancel
      </button>
    </div>
  );
};

export default ConfirmRidePOP;