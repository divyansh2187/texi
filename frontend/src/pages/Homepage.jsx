
import React, { useState, useRef, useEffect, useContext } from "react";
import { CiUser } from "react-icons/ci";
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

  // Main search panel animation
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

  // Vehicle panel animation
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

  // Confirm ride panel animation
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

  // Looking for driver panel animation
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
    try {
      setLoading(true);

      const estimate = await getRideEstimate(pickup, destination);

      setRideEstimate(estimate);
      setvehicalpanel(true);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Create ride
  // Create ride
  const handleCreateRide = async () => {
    try {
      if (!currentLocation) {
        setError("Your GPS location is not available. Please allow location access.");
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
          lat: Number(rideEstimate?.data?.destinationCoordinates?.lat),
          lng: Number(rideEstimate?.data?.destinationCoordinates?.lng),
        },
        vehicleType: selectedVehicle,
        fare: rideEstimate?.data?.fare[selectedVehicle] || 0,
      };

      console.log("Sending ride data:", rideData);

      const result = await createRide(rideData);

      console.log("Ride created successfully:", result);
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
    if (
      rideStage !== "accepted" &&
      rideStage !== "ongoing"
    ) {
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



  // =====================================================
  // IMPORTANT: RENDER ONLY RIDING SCREEN AFTER ACCEPTANCE
  // =====================================================

  if (rideStage === "accepted" || rideStage === "ongoing") {
    return (
      <Riding
        pickup={Ride?.pickup}
        destination={Ride?.destination}
        selectedVehicle={Ride?.vehicleType}
        ride={Ride}
        rideStage={rideStage}
        pickupCoordinates={Ride?.pickupCoordinates || rideEstimate?.data?.pickupCoordinates}
        destinationCoordinates={
          Ride?.destinationCoordinates ||
          rideEstimate?.data?.destinationCoordinates
        }
        passengerLocation={currentLocation}
      />
    );
  }

  // =====================================================
  // RIDE COMPLETED SCREEN
  // =====================================================

  if (rideStage === "completed") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-5">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center w-full max-w-md">

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
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
              <span className="font-bold text-lg">
                ₹{Ride?.fare}
              </span>
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

  // =====================================================
  // NORMAL BOOKING SCREEN
  // =====================================================

  return (
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
          destinationCoordinates={rideEstimate?.data?.destinationCoordinates}
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
                className={`bg-amber-700 text-white p-3 rounded-lg w-full mt-2 ${loading
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
        className="fixed w-full h-[52%] v-[60] z-20 bottom-0 translate-y-full px-3 pb-3"
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
        className="w-full translate-y-full h-[52%] fixed v-[60] bottom-0 z-30 px-3 pb-3"
      >
        <LookingForDriver
          selectedVehicle={selectedVehicle}
          setLookingForDriver={setLookingForDriver}
        />
      </div>


    </div>
  );
};

export default Homepage;
