
import React, { useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { startRide } from "../api/ride.api";

const ConfirmRidePOP = ({
  setridePOPup,
  setConfirmRidePanel,
  ride,
  onRideStarted,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const x = useMotionValue(0);
  const navigate = useNavigate();

  const handleRideStart = async () => {
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setError("Enter a valid 4-digit OTP");
      animate(x, 0, { type: "spring", stiffness: 300 });
      return;
    }

    if (!ride?._id) {
      setError("Ride information is missing");
      animate(x, 0, { type: "spring", stiffness: 300 });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await startRide(ride._id, otp);

      if (!response?.success || !response?.data) {
        throw new Error(response?.message || "Unable to start ride");
      }

      navigate("/captain-OngoingRide", {
        state: {
          ride: response.data,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "OTP verification failed",
      );

      animate(x, 0, { type: "spring", stiffness: 300 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      w-full
      bg-white
      rounded-t-[30px]
      px-4 pt-4 pb-5
      shadow-2xl
      md:rounded-3xl
      md:px-5 md:py-5
      md:max-h-[calc(100vh-2.5rem)]
      md:overflow-y-auto
    ">
      <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto md:hidden" />

      <div className="mt-3 md:mt-0 text-center">
        <h1 className="text-2xl md:text-xl font-bold text-gray-900">
          Start Ride
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the OTP provided by your passenger
        </p>
      </div>

      <form className="mt-5 md:mt-4" onSubmit={(e) => e.preventDefault()}>
        <label className="text-sm font-semibold text-gray-700">
          Ride OTP
        </label>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
            setError("");
          }}
          placeholder="Enter 4-digit OTP"
          className="w-full mt-2 bg-gray-100 border-2 border-transparent focus:border-green-500 outline-none rounded-2xl px-4 py-4 text-lg font-semibold tracking-[8px]"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-6 md:mt-4 relative w-full h-14 bg-gray-900 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-semibold text-white">
              {loading ? "Verifying OTP..." : "Swipe to Start Ride"}
            </p>
          </div>

          <motion.div
            drag={loading || otp.length !== 4 ? false : "x"}
            dragConstraints={{ left: 0, right: 260 }}
            style={{ x }}
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
            className="absolute left-1 top-1 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 text-xl font-bold cursor-pointer shadow-lg"
          >
            →
          </motion.div>
        </div>
      </form>

      <button
        disabled={loading}
        onClick={() => {
          setridePOPup(false);
          setConfirmRidePanel(false);
        }}
        className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-2xl font-semibold disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
};

export default ConfirmRidePOP;
