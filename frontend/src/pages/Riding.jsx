
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FaHome,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCircle,
  FaClock,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import RideMap from "../components/RideMap";
import { getCaptainRoute } from "../api/map.api";

const getDistanceInMeters = (point1, point2) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const R = 6371000;

  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Riding = ({
  pickup,
  destination,
  selectedVehicle,
  ride,
  rideStage,
  pickupCoordinates,
  destinationCoordinates,
  passengerLocation,
}) => {
  const navigate = useNavigate();
  const { receiveMessage } = useContext(SocketContext);

  const [captainLocation, setCaptainLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const lastRouteRequest = useRef(null);
  const isFetchingRoute = useRef(false);

  const vehicleNames = {
    car: "TexiGo",
    motorcycle: "Moto",
    moto: "Moto",
    auto: "Auto",
  };

  const vehicleName = vehicleNames[selectedVehicle] || "TexiGo";

  const captain = ride?.captainId;

  const captainName = captain?.fullname
    ? `${captain.fullname.firstname || ""} ${captain.fullname.lastname || ""}`.trim()
    : "Your Driver";

  const vehicleNumber =
    captain?.vehicle?.plate || "Vehicle details unavailable";

  const vehicleImage =
    selectedVehicle === "car"
      ? "https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png"
      : selectedVehicle === "motorcycle" || selectedVehicle === "moto"
      ? "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n"
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiYZNGPspo5yDiYR9DP05wsjLh1skE79Jfng&s";

  // Receive captain's live location
  useEffect(() => {
    if (!ride?._id) return;

    const cleanup = receiveMessage("captain-location-updated", (data) => {
      if (String(data.rideId) !== String(ride._id)) return;

      setCaptainLocation(data.location);
    });

    return cleanup;
  }, [ride?._id, receiveMessage]);

  // Calculate live road route
  useEffect(() => {
    let cancelled = false;

    const calculateRoute = async (origin, destinationPoint) => {
      if (isFetchingRoute.current) return;

      isFetchingRoute.current = true;

      try {
        const result = await getCaptainRoute(origin, destinationPoint);

        if (cancelled) return;

        if (result.success) {
          setRouteCoordinates(result.data.routeCoordinates || []);

          lastRouteRequest.current = {
            location: origin,
            time: Date.now(),
          };
        }
      } catch (error) {
        console.error(
          "Captain route calculation error:",
          error.response?.data?.message || error.message
        );
      } finally {
        isFetchingRoute.current = false;
      }
    };

    if (rideStage === "ongoing") {
      lastRouteRequest.current = null;

      if (pickupCoordinates && destinationCoordinates) {
        calculateRoute(pickupCoordinates, destinationCoordinates);
      }
    } else if (
      rideStage === "accepted" &&
      captainLocation &&
      passengerLocation
    ) {
      const now = Date.now();
      const previous = lastRouteRequest.current;

      if (!previous) {
        calculateRoute(captainLocation, passengerLocation);
      } else {
        const distanceMoved = getDistanceInMeters(
          previous.location,
          captainLocation
        );

        const timePassed = now - previous.time;

        if (distanceMoved >= 60 && timePassed >= 10000) {
          calculateRoute(captainLocation, passengerLocation);
        }
      }
    }

    return () => {
      cancelled = true;
    };
  }, [
    captainLocation,
    passengerLocation,
    pickupCoordinates,
    destinationCoordinates,
    rideStage,
  ]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">

      {/* Live Map */}
      <div className="absolute inset-0 z-0">
        <RideMap
          currentLocation={captainLocation}
          passengerLocation={passengerLocation}
          isCaptainLocation={true}
          pickupCoordinates={pickupCoordinates}
          destinationCoordinates={destinationCoordinates}
          routeCoordinates={routeCoordinates}
          rideStage={rideStage}
        />
      </div>

      {/* Ride Status */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/85 backdrop-blur-md px-5 py-3 rounded-full flex items-center gap-3 shadow-xl whitespace-nowrap">
        <FaCircle className="text-green-400 text-[9px] animate-pulse" />
        <p className="text-white text-sm font-semibold">
          {rideStage === "accepted"
            ? "Captain is on the way"
            : "Ride in Progress"}
        </p>
      </div>

      {/* Bottom Ride Panel */}
      <div className="absolute bottom-0 left-0 w-full h-[55%] bg-white rounded-t-[35px] shadow-2xl z-10 flex flex-col">

        <div className="flex-1 overflow-y-auto px-4 py-4">

          {/* Heading */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {rideStage === "accepted"
                  ? "Driver On The Way"
                  : "Enjoy Your Ride"}
              </h1>

              <p className="text-xs text-gray-500 mt-1">
                {rideStage === "accepted"
                  ? "Your ride has been confirmed"
                  : "Your trip is in progress"}
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

              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-2xl p-2">
                  <img
                    src={vehicleImage}
                    alt={vehicleName}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-base font-bold leading-none capitalize">
                    {captainName}
                  </h2>

                  <p className="text-gray-500 text-xs mt-1 capitalize">
                    {vehicleName}
                  </p>

                  <h1 className="text-base font-black mt-2 tracking-wide uppercase">
                    {vehicleNumber}
                  </h1>
                </div>
              </div>

              <div className="bg-amber-100 border border-amber-200 px-3 py-2 rounded-2xl flex flex-col items-center min-w-[85px]">
                <FaClock className="text-amber-700 text-sm mb-1" />

                <p className="text-[10px] text-gray-500">
                  {rideStage === "accepted" ? "Arriving" : "Status"}
                </p>

                <h2 className="text-xs font-bold text-center">
                  {rideStage === "accepted" ? "2 mins away" : "On trip"}
                </h2>
              </div>
            </div>

            {/* Driver Stats */}
            <div className="flex items-center justify-between mt-3 bg-gray-50 rounded-2xl px-3 py-2">
              <div className="flex items-center gap-2">
                <FaStar className="text-amber-400 text-sm" />
                <p className="font-bold text-xs">4.9</p>
              </div>

              <div className="h-4 w-[1px] bg-gray-300"></div>

              <p className="text-xs font-medium text-gray-600">
                324 Trips
              </p>

              <div className="h-4 w-[1px] bg-gray-300"></div>

              <p className="text-xs font-semibold text-green-600">
                Verified
              </p>
            </div>
          </div>

          {/* OTP */}
          {rideStage === "accepted" && (
            <div className="w-full bg-black text-white rounded-3xl px-4 py-3 flex justify-between items-center mt-4 shadow-lg">
              <div>
                <p className="text-[11px] text-gray-300">
                  Share OTP with Driver
                </p>

                <h1 className="text-2xl font-black tracking-[6px] mt-1">
                  {ride?.otp || "----"}
                </h1>
              </div>

              <div className="bg-white/10 px-3 py-2 rounded-2xl">
                <p className="text-[11px] text-gray-300">
                  Secure Ride
                </p>
              </div>
            </div>
          )}

          {/* Ride Info */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 mt-4 shadow-sm">

            <div className="flex items-start gap-3 p-3 border-b border-gray-100">
              <div className="bg-black rounded-full p-2 mt-1">
                <FaMapMarkerAlt className="text-white text-[10px]" />
              </div>

              <div className="overflow-hidden">
                <h3 className="text-[10px] text-gray-500 font-medium">
                  Pickup Location
                </h3>

                <p className="font-semibold text-xs text-gray-900 break-words">
                  {pickup || ride?.pickup || "Pickup unavailable"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3">
              <div className="bg-green-500 rounded-full p-2 mt-1">
                <FaMapMarkerAlt className="text-white text-[10px]" />
              </div>

              <div className="overflow-hidden">
                <h3 className="text-[10px] text-gray-500 font-medium">
                  Destination
                </h3>

                <p className="font-semibold text-xs text-gray-900 break-words">
                  {destination || ride?.destination || "Destination unavailable"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-3 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent px-4 pt-3 pb-4">

          <div className="flex-1 bg-black text-white py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg">
            <FaMoneyBillWave />
            Payment Pending
          </div>

          <button
            onClick={() => navigate("/UserHome")}
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
