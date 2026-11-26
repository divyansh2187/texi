
import React, { useState, useRef, useEffect, useContext } from "react";
import { CiUser } from "react-icons/ci";
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaClock,
  FaCar,
  FaMotorcycle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SlArrowDown } from "react-icons/sl";
import axios from "axios";

import Suggestion from "../components/Suggestion";
import VehiclePanel from "../components/VehicalPanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/Looking";

import { getRideEstimate } from "../api/map.api";
import { createRide } from "../api/ride.api";

import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";

import Riding from "./Riding";
import RideMap from "../components/RideMap";

const Homepage = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  const [panelOpen, setpanelOpen] = useState(false);
  const [vehicalpanel, setvehicalpanel] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState("car");

  const [confirmRide1, setConfirmRide1] = useState(false);
  const [lookingForDriver, setLookingForDriver] = useState(false);
  const [driverFound, setDriverFound] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("");

  const [rideEstimate, setRideEstimate] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [Ride, setRide] = useState(null);
  const [rideStage, setRideStage] = useState("searching");

  const panelref = useRef(null);
  const vehicalpanelref = useRef(null);
  const panelcloseref = useRef(null);
  const confirmrideref = useRef(null);
  const lookingref = useRef(null);

  const { User } = useContext(UserDataContext);
  const { sendMessage, receiveMessage } = useContext(SocketContext);

  // Main search panel animation - mobile
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelref.current, {
        height: "70%",
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(panelcloseref.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelref.current, {
        height: "0%",
        duration: 0.5,
        ease: "power2.in",
      });

      gsap.to(panelcloseref.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [panelOpen]);

  // Vehicle panel animation - mobile
  useGSAP(() => {
    if (vehicalpanel) {
      gsap.to(vehicalpanelref.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(vehicalpanelref.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [vehicalpanel]);

  // Confirm ride panel animation - mobile
  useGSAP(() => {
    if (confirmRide1) {
      gsap.to(confirmrideref.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmrideref.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [confirmRide1]);

  // Looking for driver panel animation - mobile
  useGSAP(() => {
    if (lookingForDriver) {
      gsap.to(lookingref.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(lookingref.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [lookingForDriver]);

  // Address suggestions
  useEffect(() => {
    const value = activeField === "pickup" ? pickup : destination;

    const timer = setTimeout(async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/map/suggestions`,
          {
            params: { input: value },
            withCredentials: true,
          }
        );

        setSuggestions(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pickup, destination, activeField]);

  // Get fare, duration and distance
  const handleFindRide = async () => {
    if (!pickup.trim() || !destination.trim()) {
      setError("Please enter both pickup and destination.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const estimate = await getRideEstimate(pickup, destination);

      setRideEstimate(estimate);
      setvehicalpanel(true);
      setpanelOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to calculate ride estimate.");
    } finally {
      setLoading(false);
    }
  };

  // Create ride
  const handleCreateRide = async () => {
    try {
      if (!currentLocation) {
        setError("Your GPS location is not available. Please allow location access.");
        return;
      }

      const destinationCoords = rideEstimate?.data?.destinationCoordinates;

      if (
        !destinationCoords ||
        !Number.isFinite(Number(destinationCoords.lat)) ||
        !Number.isFinite(Number(destinationCoords.lng))
      ) {
        setError("Destination coordinates are unavailable. Please search again.");
        return;
      }

      const rideData = {
        pickup,
        pickupCoordinates: {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        },
        destination,
        destinationCoordinates: {
          lat: Number(destinationCoords.lat),
          lng: Number(destinationCoords.lng),
        },
        vehicleType: selectedVehicle,
        fare: rideEstimate?.data?.fare?.[selectedVehicle] || 0,
      };

      console.log("Sending ride data:", rideData);

      const result = await createRide(rideData);

      console.log("Ride created successfully:", result);
      setError(null);
    } catch (err) {
      console.error("Create ride error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create ride");
    }
  };

  // Passenger receives ride confirmation
  useEffect(() => {
    const cleanup = receiveMessage("ride-confirmed", (data) => {
      console.log("Ride confirmed:", data);

      setRide(data.ride);
      setRideStage("accepted");

      setLookingForDriver(false);
      setConfirmRide1(false);
      setvehicalpanel(false);
      setDriverFound(true);
    });

    return cleanup;
  }, [receiveMessage]);

  // Passenger receives ride started event
  useEffect(() => {
    const cleanup = receiveMessage("ride-started", (data) => {
      console.log("Ride started:", data);

      setRide(data.ride);
      setRideStage("ongoing");
      setDriverFound(false);
    });

    return cleanup;
  }, [receiveMessage]);

  // Passenger receives ride completed event
  useEffect(() => {
    const cleanup = receiveMessage("ride-completed", (data) => {
      console.log("Ride completed:", data);

      setRide(data.ride);
      setRideStage("completed");
      setDriverFound(false);
    });

    return cleanup;
  }, [receiveMessage]);

  // Passenger GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    let hasSetInitialPickup = false;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCurrentLocation({
          lat: latitude,
          lng: longitude,
        });

        // Set pickup address using the first GPS location only
        if (!hasSetInitialPickup) {
          hasSetInitialPickup = true;

          try {
            const res = await axios.get(
              `${import.meta.env.VITE_BASEURL}/map/reverse-geocode`,
              {
                params: {
                  lat: latitude,
                  lng: longitude,
                },
                withCredentials: true,
              }
            );

            setPickup(res.data.data?.address ?? "");
          } catch (error) {
            console.error("Reverse geocoding error:", error);
          }
        }
      },
      (error) => {
        console.error("Passenger GPS error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Join passenger socket room
  useEffect(() => {
    if (!User?._id) return;

    console.log("Joining socket:", User._id);

    sendMessage("joinRoom", {
      userId: User._id,
      userType: "user",
    });
  }, [User, sendMessage]);

  // Share passenger live GPS with assigned captain
  useEffect(() => {
    if (rideStage !== "accepted" && rideStage !== "ongoing") {
      return;
    }

    if (!Ride?._id || !User?._id || !currentLocation) {
      return;
    }

    console.log("Sharing passenger GPS:", currentLocation);

    sendMessage("update-location-user", {
      userId: User._id,
      rideId: Ride._id,
      location: {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      },
    });
  }, [rideStage, Ride?._id, User?._id, currentLocation, sendMessage]);

  // Render passenger ride screen after acceptance
  if (rideStage === "accepted" || rideStage === "ongoing") {
    return (
      <Riding
        pickup={Ride?.pickup}
        destination={Ride?.destination}
        selectedVehicle={Ride?.vehicleType}
        ride={Ride}
        rideStage={rideStage}
        pickupCoordinates={
          Ride?.pickupCoordinates || rideEstimate?.data?.pickupCoordinates
        }
        destinationCoordinates={
          Ride?.destinationCoordinates ||
          rideEstimate?.data?.destinationCoordinates
        }
        passengerLocation={currentLocation}
      />
    );
  }

  // Ride completed screen
  if (rideStage === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center w-full max-w-md">
          <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-full mx-auto mb-5">
            <span className="text-green-600 text-4xl">✓</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Ride Completed!
          </h1>

          <p className="text-gray-500 mt-2">
            You have successfully reached your destination.
          </p>

          <div className="bg-gray-100 rounded-2xl p-4 mt-6 text-left">
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-semibold">{Ride?.pickup}</p>

            <p className="text-sm text-gray-500 mt-4">Destination</p>
            <p className="font-semibold">{Ride?.destination}</p>

            <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between">
              <span className="font-semibold">Total Fare</span>
              <span className="font-bold text-lg">₹{Ride?.fare}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setRide(null);
              setRideStage("searching");
              setDriverFound(false);

              setLookingForDriver(false);
              setConfirmRide1(false);
              setvehicalpanel(false);
              setpanelOpen(false);

              setPickup("");
              setDestination("");
              setRideEstimate(null);
              setError(null);
            }}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold mt-6"
          >
            Book Another Ride
          </button>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes) => {
    if (minutes == null) return "--";

    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);

    return remainingMinutes
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

 const vehicleOptions = [
  {
    id: "car",
    name: "TexiGo",
    description: "Affordable, comfortable rides",
    capacity: "4 seats",
    image:
      "https://tb-static.uber.com/prod/udam-assets/50b5e341-5426-42fd-acfe-037d63333de5.png",
  },
  {
    id: "motorcycle",
    name: "Moto",
    description: "Quick and affordable bike rides",
    capacity: "1 seat",
    image:
      "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=552/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85NTM4NTEyZC1mZGUxLTRmNzMtYmQ1MS05Y2VmZjRlMjU0ZjEucG5n",
  },
  {
    id: "auto",
    name: "Auto",
    description: "Budget-friendly everyday rides",
    capacity: "3 seats",
    image:
      "https://tb-static.uber.com/prod/udam-assets/4e718d5c-e431-59c5-acb5-ac40c26c24df.webp",
  },
];

  return (
    <>
      {/* ================================================== */}
      {/* DESKTOP AND TABLET LAYOUT */}
      {/* ================================================== */}

      <div className="hidden md:flex flex-col h-screen w-full overflow-hidden bg-[#f4f4f1]">
        {/* Top navigation */}
        <header className="h-[76px] shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-7 lg:px-10 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <FaLocationArrow className="text-white text-lg" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                texi
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                Move freely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 hidden lg:block">
              Your everyday ride, made simple.
            </span>

            <button
              className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              aria-label="User profile"
            >
              <CiUser className="text-2xl text-gray-800" />
            </button>
          </div>
        </header>

        {/* Main workspace */}
        <main className="flex-1 min-h-0 flex">
          {/* Map area */}
          <section className="relative flex-1 min-w-0">
            <div className="absolute inset-0">
              <RideMap
                currentLocation={currentLocation}
                pickupCoordinates={rideEstimate?.data?.pickupCoordinates}
                destinationCoordinates={
                  rideEstimate?.data?.destinationCoordinates
                }
                routeCoordinates={rideEstimate?.data?.routeCoordinates || []}
              />
            </div>

            {/* Map label */}
            <div className="absolute top-5 left-5 z-[500] bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-800">
                  Live map
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your location and route
              </p>
            </div>
          </section>

          {/* Right-side booking panel */}
         <aside className="w-[320px] lg:w-[380px] xl:w-[420px] shrink-0 bg-[#f8f8f6] border-l border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-5 lg:p-6 space-y-5">
              {/* Panel heading */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-semibold">
                    Passenger
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {lookingForDriver
                      ? "Finding your ride"
                      : confirmRide1
                        ? "Confirm your ride"
                        : vehicalpanel
                          ? "Choose your ride"
                          : "Where to?"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {lookingForDriver
                      ? "We're looking for a nearby captain."
                      : "Plan your journey with Texi."}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setPickup("");
                    setDestination("");
                    setRideEstimate(null);
                    setvehicalpanel(false);
                    setConfirmRide1(false);
                    setLookingForDriver(false);
                    setError(null);
                  }}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black"
                  title="Reset booking"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Looking for driver */}
              {lookingForDriver ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                  <LookingForDriver
                    selectedVehicle={selectedVehicle}
                    setLookingForDriver={setLookingForDriver}
                  />
                </div>
              ) : confirmRide1 ? (
                /* Confirm ride card */
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm min-h-[400px]">
                  <ConfirmRide
                    setConfirmRide={setConfirmRide1}
                    selectedVehicle={selectedVehicle}
                    setLookingForDriver={setLookingForDriver}
                    pickup={pickup}
                    destination={destination}
                    rideEstimate={rideEstimate}
                    handleCreateRide={handleCreateRide}
                    setvehicalpanel={setvehicalpanel}
                  />
                </div>
              ) : vehicalpanel ? (
                /* Vehicle selection cards */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="font-bold text-gray-900 mt-1">
                        {rideEstimate?.data?.distance?.kilometers ?? "--"} km
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Estimated time</p>
                      <p className="font-bold text-gray-900 mt-1">
                        {formatDuration(
                          rideEstimate?.data?.duration?.minutes
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {vehicleOptions.map((vehicle) => {
                     
                      const isSelected = selectedVehicle === vehicle.id;

                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => {
                            setSelectedVehicle(vehicle.id);
                            setConfirmRide1(true);
                            setvehicalpanel(false);
                          }}
                          className={`w-full flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                            isSelected
                              ? "border-amber-400 bg-amber-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                           <div className="w-20 h-16 shrink-0 flex items-center justify-center">
  <img
    src={vehicle.image}
    alt={vehicle.name}
    className="w-full h-full object-contain"
  />
</div>

                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900">
                                {vehicle.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {vehicle.description}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {vehicle.capacity}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="font-bold text-gray-900">
                              ₹
                              {rideEstimate?.data?.fare?.[vehicle.id] ?? "--"}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              Estimated
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setvehicalpanel(false);
                      setpanelOpen(true);
                    }}
                    className="w-full py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Edit locations
                  </button>
                </div>
              ) : (
                /* Booking form */
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center pt-3">
                        <span className="w-3 h-3 rounded-full border-[3px] border-gray-800 bg-white" />
                        <span className="w-px h-12 bg-gray-300" />
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2">
                            PICKUP LOCATION
                          </label>
                          <input
                            type="text"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            onFocus={() => {
                              setActiveField("pickup");
                              setpanelOpen(true);
                            }}
                            placeholder="Enter pickup location"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2">
                            DESTINATION
                          </label>
                          <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onFocus={() => {
                              setActiveField("destination");
                              setpanelOpen(true);
                            }}
                            placeholder="Where are you going?"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop suggestions */}
                  {panelOpen && suggestions.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-h-64 overflow-y-auto">
                      <Suggestion
                        suggestions={suggestions}
                        activeField={activeField}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        setpanelOpen={setpanelOpen}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleFindRide}
                    className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                  >
                    {loading ? "Calculating route..." : "Find a ride"}
                    {!loading && <FaLocationArrow />}
                  </button>

                  <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <FaMapMarkerAlt className="text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Live location
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {currentLocation
                            ? "Your GPS location is available"
                            : "Waiting for location permission"}
                        </p>
                      </div>
                      <span
                        className={`ml-auto w-2.5 h-2.5 rounded-full ${
                          currentLocation ? "bg-green-500" : "bg-amber-400"
                        }`}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-400">
                    Safe, simple and reliable rides with Texi.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>

      {/* ================================================== */}
      {/* ORIGINAL MOBILE LAYOUT - PRESERVED */}
      {/* ================================================== */}

      <div className="md:hidden">
        <div className="">
          {/* Top Navbar */}
          <div className="w-full mt-1 ml-1 flex absolute justify-between z-20 pointer-events-none">
            <h1 className="font-light text-black text-3xl sm:text-4xl">
              Texi
            </h1>

            <div className="mr-2">
              <CiUser className="text-4xl" />
            </div>
          </div>

          {/* Interactive Map Background */}
          <div className="absolute inset-0 z-0 h-screen w-full">
            <RideMap
              currentLocation={currentLocation}
              pickupCoordinates={rideEstimate?.data?.pickupCoordinates}
              destinationCoordinates={
                rideEstimate?.data?.destinationCoordinates
              }
              routeCoordinates={rideEstimate?.data?.routeCoordinates || []}
            />
          </div>

          {/* Main Panel */}
          <div className="h-screen w-full top-0 flex flex-col justify-end absolute z-10 pointer-events-none">
            <div className="p-2 h-[30%] relative w-full bg-white rounded-t-4xl pointer-events-auto">
              <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl font-bold ml-5 mt-4">
                  Find a ride
                </h1>

                <SlArrowDown
                  ref={panelcloseref}
                  onClick={() => {
                    setpanelOpen(false);
                  }}
                  className="mt-2 mr-5 opacity-0 text-amber-700"
                />
              </div>

              <div className="h-15 w-1 bg-gray-700 absolute rounded-full top-[39%] left-[15%]"></div>

              <div className="h-[50%] ml-5 mr-5 mt-2 flex flex-col gap-2">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex gap-3 flex-col mt-3"
                >
                  <input
                    type="text"
                    className="p-3 bg-gray-100 rounded-lg w-full text-center"
                    placeholder="add a pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onClick={() => {
                      setpanelOpen(true);
                      setActiveField("pickup");
                    }}
                  />

                  <input
                    type="text"
                    className="p-3 bg-gray-100 rounded-lg w-full text-center"
                    placeholder="enter your destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onClick={() => {
                      setpanelOpen(true);
                      setActiveField("destination");
                    }}
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      handleFindRide();
                      setpanelOpen(false);
                    }}
                    className={`bg-amber-700 text-white p-3 rounded-lg w-full mt-2 ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-amber-800 transition-all duration-300"
                    }`}
                  >
                    {loading ? "Finding..." : "Find a Ride"}
                  </button>
                </form>
              </div>
            </div>

            {/* Suggestion Panel */}
            <div
              ref={panelref}
              className="w-full bg-gray-100 p-1 h-0 overflow-hidden pointer-events-auto"
            >
              <Suggestion
                suggestions={suggestions}
                activeField={activeField}
                setPickup={setPickup}
                setDestination={setDestination}
                setpanelOpen={setpanelOpen}
              />
            </div>
          </div>

          {/* Vehicle Panel */}
          <div>
            <VehiclePanel
              vehicalpanelref={vehicalpanelref}
              setvehicalpanel={setvehicalpanel}
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
              confirmRide={confirmRide1}
              setConfirmRide={setConfirmRide1}
              rideEstimate={rideEstimate}
              setpanelOpen={setpanelOpen}
            />
          </div>

          {/* Confirm Ride Panel */}
          <div
            ref={confirmrideref}
            className="fixed w-full h-[52%] z-20 bottom-0 translate-y-full px-3 pb-3"
          >
            <ConfirmRide
              setConfirmRide={setConfirmRide1}
              selectedVehicle={selectedVehicle}
              setLookingForDriver={setLookingForDriver}
              pickup={pickup}
              destination={destination}
              rideEstimate={rideEstimate}
              handleCreateRide={handleCreateRide}
              setvehicalpanel={setvehicalpanel}
            />
          </div>

          {/* Looking For Driver Panel */}
          <div
            ref={lookingref}
            className="w-full translate-y-full h-[52%] fixed bottom-0 z-30 px-3 pb-3"
          >
            <LookingForDriver
              selectedVehicle={selectedVehicle}
              setLookingForDriver={setLookingForDriver}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
