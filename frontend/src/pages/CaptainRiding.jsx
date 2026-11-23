import React, { useState, useEffect, useContext, useRef } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
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

import {
  FaLocationArrow,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useLocation } from "react-router-dom";
import ConfirmRidePOP from "../components/confirmRidePOP";



const MapUpdater = ({ captainLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (captainLocation) {
      map.setView(
        [captainLocation.lat, captainLocation.lng],
        16
      );
    }
  }, [captainLocation, map]);

  return null;
};




const CaptainRiding = () => {
  const { captain } = useContext(CaptainDataContext);
  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const location = useLocation();


  // Get ride data passed from CaptainHome
  const [ride, setRide] = useState(
    location.state?.ride?.data || location.state?.ride || {},
  );

  console.log("RIDE DATA:", ride);

  const [showDetails, setShowDetails] = useState(true);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [passengerLocation, setPassengerLocation] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [remainingDuration, setRemainingDuration] = useState(null);



  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const captainLocationRef = useRef(null);
  const passengerLocationRef = useRef(null);

  const lastRouteRef = useRef({
    captain: null,
    passenger: null,
  });

  captainLocationRef.current = captainLocation;
  passengerLocationRef.current = passengerLocation;

  console.log("CAPTAIN LOCATION STATE:", captainLocation);

  // Actual backend response uses userId
  const passengerName = ride?.userId?.fullname
    ? `${ride.userId.fullname.firstname || ""} ${ride.userId.fullname.lastname || ""}`.trim()
    : "Passenger";

  const pickup = ride?.pickup || "Pickup location";
  const destination = ride?.destination || "Destination";

  const fare = ride?.fare;
  const distance = ride?.distance;
  const duration = ride?.duration;



  useEffect(() => {
    if (!captain?._id) {
      console.log("Captain ID not available");
      return;
    }

    // Register captain's socket connection
    sendMessage("joinRoom", {
      userId: captain._id,
      userType: "captain",
    });

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    console.log("Captain live GPS tracking started");

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCaptainLocation({
          lat: latitude,
          lng: longitude,
        });

        console.log("Captain GPS:", latitude, longitude);
        sendMessage("update-location-captain", {
          captainId: captain._id,
          rideId: ride?._id,
          location: {
            lat: latitude,
            lng: longitude,
          },
        });
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
      console.log("Captain GPS tracking stopped");
    };

  }, [captain?._id, sendMessage]);


  // Receive passenger's live GPS location
  useEffect(() => {
    if (!ride?._id) return;

    const cleanup = receiveMessage("user-location-updated", (data) => {
      console.log("Passenger location event received:", data);

      if (String(data.rideId) !== String(ride._id)) {
        console.log("Passenger location belongs to another ride");
        return;
      }

      setPassengerLocation(data.location);

      console.log("Live passenger location:", data.location);
    });

    return cleanup;
  }, [ride?._id, receiveMessage]);

  // Calculate live route based on ride status
  useEffect(() => {
    let isFetching = false;

    const getDistanceInMeters = (a, b) => {
      const toRad = (value) => (value * Math.PI) / 180;

      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);

      const value =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) *
        Math.cos(toRad(b.lat)) *
        Math.sin(dLng / 2) ** 2;

      return (
        6371000 *
        2 *
        Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
      );
    };

    const calculateRoute = async () => {
      const captainPos = captainLocationRef.current;
      const passengerPos = passengerLocationRef.current;

      if (!captainPos || isFetching) return;

      let targetPos = null;

      if (ride.status === "accepted") {
        targetPos = passengerPos;
      } else if (ride.status === "ongoing") {
        targetPos = ride.destinationCoordinates;
      } else {
        return;
      }

      if (
        !targetPos ||
        !Number.isFinite(Number(targetPos.lat)) ||
        !Number.isFinite(Number(targetPos.lng))
      ) {
        return;
      }

      const target = {
        lat: Number(targetPos.lat),
        lng: Number(targetPos.lng),
      };

      const previous = lastRouteRef.current;

      const hasMoved =
        !previous.captain ||
        !previous.target ||
        previous.stage !== ride.status ||
        getDistanceInMeters(previous.captain, captainPos) >= 30 ||
        getDistanceInMeters(previous.target, target) >= 30;

      if (!hasMoved) return;

      isFetching = true;

      try {
        const result = await getCaptainRoute(captainPos, target);

        if (result.success && result.data) {
          setRouteCoordinates(result.data.routeCoordinates || []);

          setRemainingDistance(
            result.data.distance?.kilometers ?? null
          );

          setRemainingDuration(
            result.data.duration?.minutes ?? null
          );

          lastRouteRef.current = {
            captain: { ...captainPos },
            target,
            stage: ride.status,
          };

          console.log("Live route updated:", result.data);
        }
      } catch (error) {
        console.error("Route calculation failed:", error);
      } finally {
        isFetching = false;
      }
    };

    calculateRoute();

    const timer = setInterval(calculateRoute, 5000);

    return () => clearInterval(timer);
  }, [ride.status, ride.destinationCoordinates?.lat, ride.destinationCoordinates?.lng]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100">
      {/* Live GPS Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[26.100748, 74.294059]}
          zoom={15}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Actual road route */}
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
          <MapUpdater captainLocation={captainLocation} />

          {captainLocation && (
            <Marker
              position={[captainLocation.lat, captainLocation.lng]}
              icon={captainIcon}
            />
          )}

        {/* Show passenger marker only before the ride starts */}
{ride.status === "accepted" && passengerLocation && (
    <Marker
        position={[
            passengerLocation.lat,
            passengerLocation.lng,
        ]}
    />
)}


          {/* Destination marker */}
          {ride.status === "ongoing" && ride.destinationCoordinates && (
            <Marker
              position={[
                ride.destinationCoordinates.lat,
                ride.destinationCoordinates.lng,
              ]}
            />
          )}




        </MapContainer>
      </div>

      {/* Status */}
      {/* Status */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
          <p className="text-white text-sm font-semibold">
            {ride.status === "ongoing"
              ? "Ride in Progress"
              : "Heading to pickup"}
          </p>
        </div>
      </div>

      {/* Bottom Panel */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[32px] px-5 shadow-2xl transition-all duration-300 ${showDetails ? "py-5" : "py-4"
          }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ride.status === "ongoing"
                ? "Destination"
                : "Pickup location"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {ride.status === "ongoing"
                ? "Navigate to the destination"
                : "Navigate to the passenger"}
            </p>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-2xl"
          >
            <MdKeyboardArrowUp
              className={`transition-transform ${showDetails ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        {/* Collapsed View */}
        {!showDetails && ride.status === "accepted" && (
          <button
            onClick={() => setShowOtpPopup(true)}
            className="w-full mt-5 bg-green-600 text-white py-4 rounded-2xl font-bold"
          >
            I reached the passenger
          </button>
        )}

        {/* Expanded View */}
        {showDetails && (
          <div className="mt-5">
            {/* Passenger */}
            <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <FaUser className="text-gray-500 text-xl" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">{passengerName}</h2>

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
                  <h3 className="font-semibold text-gray-900">Destination</h3>

                  <p className="text-sm text-gray-500 mt-1">{destination}</p>
                </div>
              </div>
            </div>

            {/* Ride information */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {/* Remaining distance */}
              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <h2 className="text-lg font-bold text-gray-900">
                  {remainingDistance !== null
                    ? `${remainingDistance} KM`
                    : distance
                      ? `${distance} KM`
                      : "--"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {ride.status === "ongoing" ? "Remaining distance" : "Distance"}
                </p>
              </div>

              {/* Remaining duration */}
              <div className="bg-gray-100 rounded-2xl p-3 text-center">
                <div className="flex justify-center mb-1">
                  <FaClock className="text-gray-700" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {remainingDuration !== null
                    ? `${remainingDuration} min`
                    : duration
                      ? `${duration} min`
                      : "--"}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {ride.status === "ongoing" ? "ETA to destination" : "Duration"}
                </p>
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

            {/* Reached passenger */}
            {ride.status === "accepted" && (
              <button
                onClick={() => setShowOtpPopup(true)}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition"
              >
                I reached the passenger
              </button>
            )}

            <p className="text-center text-xs text-gray-400 mt-3">
              Verify the passenger's OTP before starting the ride.
            </p>
          </div>
        )}
      </div>

      {/* OTP Popup */}
      {showOtpPopup && ride.status === "accepted" && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50">
          <div className="w-full">
            <ConfirmRidePOP
              ride={ride}
              setridePOPup={setShowOtpPopup}
              setConfirmRidePanel={setShowOtpPopup}
              onRideStarted={(updatedRide) => {
                setRide(updatedRide);
                setShowOtpPopup(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainRiding;
