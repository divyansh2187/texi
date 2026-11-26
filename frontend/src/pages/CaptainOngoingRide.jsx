
import React, { useState, useEffect, useRef } from "react";
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
import "@tomickigrzegorz/leaflet-rotate";
import { completeRide } from "../api/ride.api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getCaptainRoute } from "../api/map.api";

// CAPTAIN ICON
const captainIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 42px;
      height: 42px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px #0005;
      border: 2px solid #FACC15;
      font-size: 25px;
    ">
      👨‍✈️
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// DESTINATION ICON
const destinationIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      box-shadow: 0 2px 8px #0005;
    ">
      📍
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// MAP UPDATER
const MapUpdater = ({ captainLocation, heading }) => {
  const map = useMap();

  useEffect(() => {
    if (!captainLocation) return;

    const center = [
      captainLocation.lat,
      captainLocation.lng,
    ];

    map.setView(center, 17, { animate: false });

    if (typeof map.setHeading === "function") {
      map.setHeading(heading ?? 0, {
        ease: 0.15,
        deadzone: 1,
      });
    }

    // Shift map center upward so captain appears lower
    // and more road is visible ahead.
    const offset = map.getSize().y * 0.22;

    map.panBy(
      [0, -offset],
      { animate: false }
    );

  }, [captainLocation, heading, map]);

  return null;
};

// DISTANCE CALCULATION
const getDistanceInMeters = (a, b) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
    Math.cos(toRad(b.lat)) *
    Math.sin(dLng / 2) ** 2;

  return 6371000 * 2 * Math.atan2(
    Math.sqrt(value),
    Math.sqrt(1 - value)
  );
};

const CaptainOngoingRide = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ride, setRide] = useState(
    location.state?.ride?.data || location.state?.ride || {}
  );

  const [captainLocation, setCaptainLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [remainingDuration, setRemainingDuration] = useState(null);
  const [heading, setHeading] = useState(0);

  const previousLocationRef = useRef(null);
  const captainLocationRef = useRef(null);

  const [showDetails, setShowDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TRACK CAPTAIN'S LIVE GPS LOCATION
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const previous = previousLocationRef.current;

        let calculatedHeading = position.coords.heading;

        if (
          calculatedHeading == null &&
          previous &&
          getDistanceInMeters(previous, location) > 3
        ) {
          const toRad = (value) => value * Math.PI / 180;
          const toDeg = (value) => value * 180 / Math.PI;

          const lat1 = toRad(previous.lat);
          const lat2 = toRad(location.lat);
          const lngDiff = toRad(location.lng - previous.lng);

          const y = Math.sin(lngDiff) * Math.cos(lat2);

          const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lngDiff);

          calculatedHeading =
            (toDeg(Math.atan2(y, x)) + 360) % 360;
        }

        if (calculatedHeading != null) {
          setHeading(calculatedHeading);
        }

        previousLocationRef.current = location;

        captainLocationRef.current = location;
        setCaptainLocation(location);
      },
      (error) => {
        console.error("Captain GPS error:", error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // CALCULATE LIVE ROUTE FROM CAPTAIN TO DESTINATION
  useEffect(() => {
    let isFetching = false;

    const lastRouteRef = {
      current: null,
    };

    const calculateRoute = async () => {
      const captainPos = captainLocationRef.current;
      const destinationPos = ride.destinationCoordinates;

      if (!captainPos || !destinationPos || isFetching) return;

      const target = {
        lat: Number(destinationPos.lat),
        lng: Number(destinationPos.lng),
      };

      if (
        !Number.isFinite(target.lat) ||
        !Number.isFinite(target.lng)
      ) return;

      const previous = lastRouteRef.current;

      if (
        previous &&
        getDistanceInMeters(previous.captain, captainPos) < 30
      ) {
        return;
      }

      isFetching = true;

      try {
        const result = await getCaptainRoute(captainPos, target);

        if (result.success && result.data) {
          setRouteCoordinates(
            result.data.routeCoordinates || []
          );

          setRemainingDistance(
            result.data.distance?.kilometers ?? null
          );

          setRemainingDuration(
            result.data.duration?.minutes ?? null
          );

          lastRouteRef.current = {
            captain: { ...captainPos },
          };

          console.log("Ongoing route updated:", result.data);
        }
      } catch (error) {
        console.error("Ongoing route error:", error);
      } finally {
        isFetching = false;
      }
    };

    calculateRoute();

    const timer = setInterval(calculateRoute, 5000);

    return () => clearInterval(timer);
  }, [
    ride._id,
    ride.destinationCoordinates?.lat,
    ride.destinationCoordinates?.lng,
  ]);

  // RIDE DETAILS
  const passengerName = ride?.userId?.fullname
    ? `${ride.userId.fullname.firstname || ""} ${ride.userId.fullname.lastname || ""}`.trim()
    : "Passenger";

  const pickup = ride?.pickup || "Pickup location";
  const destination = ride?.destination || "Destination";
  const fare = ride?.fare;
  const distance = ride?.distance;
  const duration = ride?.duration;

  // COMPLETE RIDE
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

  // RIDE VALIDATION
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

      {/* LIVE NAVIGATION MAP */}
      <div className="absolute inset-0 z-0 md:right-[340px] lg:right-[390px] xl:right-[420px]">
        <MapContainer
          center={
            captainLocation
              ? [captainLocation.lat, captainLocation.lng]
              : [26.100748, 74.294059]
          }
          zoom={17}
          rotate={true}
          bearing={0}
          touchRotate={true}
          dragRotate={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater
            captainLocation={captainLocation}
            heading={heading}
          />

          {/* CAPTAIN'S LIVE POSITION */}
          {captainLocation && (
            <Marker
              position={[
                captainLocation.lat,
                captainLocation.lng,
              ]}
              icon={captainIcon}
            />
          )}

          {/* DESTINATION */}
          {ride.destinationCoordinates && (
            <Marker
              position={[
                Number(ride.destinationCoordinates.lat),
                Number(ride.destinationCoordinates.lng),
              ]}
              icon={destinationIcon}
            />
          )}

          {/* ROAD ROUTE */}
          {routeCoordinates.length > 0 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#2563eb",
                weight: 6,
                opacity: 0.9,
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* RIDE STATUS */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 md:left-[calc((100%-340px)/2)] lg:left-[calc((100%-390px)/2)] xl:left-[calc((100%-420px)/2)]">
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

      {/* BOTTOM / DESKTOP RIDE DETAILS PANEL */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] px-5 shadow-2xl transition-all duration-300 ${
          showDetails ? "py-5" : "py-4"
        } md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[340px] md:rounded-none md:rounded-l-3xl md:overflow-y-auto md:px-5 md:py-6 lg:w-[390px] xl:w-[420px]`}
      >

        {/* PANEL HEADER */}
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

        {/* COLLAPSED VIEW */}
        {!showDetails && (
          <button
            onClick={() => setShowDetails(true)}
            className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-bold"
          >
            View Ride Details
          </button>
        )}

        {/* EXPANDED VIEW */}
        {showDetails && (
          <div className="mt-5">

            {/* PASSENGER */}
            <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <FaUser className="text-gray-500 text-xl" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    {passengerName}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Passenger
                  </p>
                </div>
              </div>
            </div>

            {/* LOCATIONS */}
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaLocationArrow className="text-green-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Pickup
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {pickup}
                  </p>
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

            {/* RIDE INFORMATION */}
            <div className="grid grid-cols-3 gap-3 mt-6">

              {/* REMAINING DISTANCE */}
              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <h2 className="text-lg font-bold text-gray-900">
                  {remainingDistance !== null
                    ? `${remainingDistance} KM`
                    : "--"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Remaining distance
                </p>
              </div>

              {/* ESTIMATED ARRIVAL */}
              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <FaClock className="text-gray-700" />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  {remainingDuration !== null
                    ? `${remainingDuration} min`
                    : "--"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  ETA to destination
                </p>
              </div>

              {/* FARE */}
              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <FaMoneyBillWave className="text-green-600" />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  {fare != null ? `₹${fare}` : "--"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Fare
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            {/* COMPLETE RIDE */}
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
