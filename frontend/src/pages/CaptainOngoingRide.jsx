
import React, { useState } from "react";
import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { completeRide } from "../api/ride.api";

const CaptainOngoingRide = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ride, setRide] = useState(
    location.state?.ride?.data || location.state?.ride || {}
  );

  const [showDetails, setShowDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passengerName = ride?.userId?.fullname
    ? `${ride.userId.fullname.firstname || ""} ${ride.userId.fullname.lastname || ""}`.trim()
    : "Passenger";

  const pickup = ride?.pickup || "Pickup location";
  const destination = ride?.destination || "Destination";
  const fare = ride?.fare;
  const distance = ride?.distance;
  const duration = ride?.duration;

  const handleCompleteRide = async () => {
    if (!ride._id) {
      setError("Ride ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await completeRide(ride._id);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to complete ride.");
      }

      setRide(response.data || { ...ride, status: "completed" });

      navigate("/CaptainHome", {
        replace: true,
        state: { completedRide: response.data },
      });
    } catch (err) {
      console.error("Complete ride error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!ride._id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Ride information unavailable
          </h2>
          <p className="text-gray-500 mt-2">
            Please return to your dashboard.
          </p>
          <button
            onClick={() => navigate("/CaptainHome")}
            className="mt-5 bg-black text-white px-6 py-3 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">

      {/* Map placeholder - live map integration will come later */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Map placeholder"
        />
      </div>

      {/* Ride status */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            {ride.status === "completed" ? (
              <>
                <FaCheckCircle className="text-green-400" />
                Ride Completed
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Ride in Progress
              </>
            )}
          </p>
        </div>
      </div>

      {/* Bottom panel */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] px-5 shadow-2xl transition-all duration-300 ${
          showDetails ? "py-5" : "py-4"
        }`}
      >

        {/* Panel header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ride in progress
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Navigate to the passenger's destination
            </p>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-2xl"
          >
            <MdKeyboardArrowUp
              className={`transition-transform ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Collapsed view */}
        {!showDetails && (
          <button
            onClick={() => setShowDetails(true)}
            className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-bold"
          >
            View Ride Details
          </button>
        )}

        {/* Expanded view */}
        {showDetails && (
          <div className="mt-5">

            {/* Passenger */}
            <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <FaUser className="text-gray-500 text-xl" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    {passengerName}
                  </h2>
                  <p className="text-sm text-gray-500">Passenger</p>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaLocationArrow className="text-green-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Pickup</h3>
                  <p className="text-sm text-gray-500 mt-1">{pickup}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-red-500" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Destination
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Ride information */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <h2 className="text-lg font-bold text-gray-900">
                  {distance != null ? `${distance} KM` : "--"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Distance</p>
              </div>

              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <FaClock className="text-gray-700" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {duration != null ? `${duration} min` : "--"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Duration</p>
              </div>

              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <FaMoneyBillWave className="text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {fare != null ? `₹${fare}` : "--"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Fare</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            {/* Complete ride */}
            <button
              onClick={handleCompleteRide}
              disabled={loading || ride.status !== "ongoing"}
              className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition ${
                loading || ride.status !== "ongoing"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white"
              }`}
            >
              {loading
                ? "Completing Ride..."
                : ride.status === "completed"
                  ? "Ride Completed"
                  : "Complete Ride"}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Complete the ride only after reaching the destination.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainOngoingRide;
