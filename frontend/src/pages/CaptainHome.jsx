
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaUserCircle,
  FaRoad,
  FaClock,
  FaStar,
  FaCircle,
  FaLocationArrow,
  FaTimes,
} from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

// Components
import POPup from "../components/POPup";
import CaptainPickupPOP from "../components/CaptainPickupPOP";
import ConfirmRidePOP from "../components/confirmRidePOP";
import RideMap from "../components/RideMap";

// Contexts
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";

// API
import { confirmRide as confirmRideAPI } from "../api/ride.api";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);
  const { sendMessage, receiveMessage } = useContext(SocketContext);

  const navigate = useNavigate();

  // STATE
  const [ridePOPup, setridePOPup] = useState(false);
  const [pickupPanel, setPickupPanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);

  const [ride, setride] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // REFS
  const ridePOPref = useRef(null);
  const pickupPOPref = useRef(null);
  const confirmRidePOPref = useRef(null);

  // CONFIRM RIDE
  const confirmRide = async (rideId) => {
    try {
      const response = await confirmRideAPI(rideId);
      console.log("FULL RESPONSE:", response);

      const confirmedRide = response?.data;

      if (!confirmedRide?._id) {
        console.error("Invalid confirmed ride:", confirmedRide);
        return;
      }

      setride(confirmedRide);

      navigate("/captain-Riding", {
        state: { ride: confirmedRide },
      });
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  };

  // RIDE POPUP ANIMATION
  useGSAP(() => {
    if (!ridePOPref.current) return;

    gsap.to(ridePOPref.current, {
      y: ridePOPup ? "0%" : "100%",
      duration: 0.5,
      ease: ridePOPup ? "power2.out" : "power2.in",
    });
  }, [ridePOPup]);

  // PICKUP POPUP ANIMATION
  useGSAP(() => {
    if (!pickupPOPref.current) return;

    gsap.to(pickupPOPref.current, {
      y: pickupPanel ? "0%" : "100%",
      duration: 0.5,
      ease: pickupPanel ? "power2.out" : "power2.in",
    });
  }, [pickupPanel]);

  // CONFIRM RIDE PANEL ANIMATION
  useGSAP(() => {
    if (!confirmRidePOPref.current) return;

    gsap.to(confirmRidePOPref.current, {
      y: confirmRidePanel ? "0%" : "100%",
      duration: 0.5,
      ease: confirmRidePanel ? "power2.out" : "power2.in",
    });
  }, [confirmRidePanel]);

  // CAPTAIN SOCKET + GPS
  useEffect(() => {
    if (!captain?._id) return;

    console.log("Captain ID:", captain._id);

    sendMessage("joinRoom", {
      userId: captain._id,
      userType: "captain",
    });

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCurrentLocation({
          lat: latitude,
          lng: longitude,
        });

        sendMessage("update-location-captain", {
          captainId: captain._id,
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
        timeout: 15000,
        maximumAge: 1000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [captain?._id, sendMessage]);

  // RECEIVE NEW RIDE
  useEffect(() => {
    const handleNewRide = (rideData) => {
      console.log("New Ride Received:", rideData);

      setride(rideData);
      setridePOPup(true);
    };

    const cleanup = receiveMessage("new-ride", handleNewRide);

    return cleanup;
  }, [receiveMessage]);

  const captainName = `${captain?.fullname?.firstname || ""} ${
    captain?.fullname?.lastname || ""
  }`.trim();

  const captainImage =
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400";

  // REUSABLE CAPTAIN PROFILE
  const CaptainProfile = () => (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <img
          className="w-14 h-14 rounded-2xl object-cover shrink-0"
          src={captainImage}
          alt="Captain"
        />

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#111827] truncate capitalize">
            {captainName || "Captain"}
          </h1>
          <p className="text-xs text-gray-500">Premium Driver</p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-[10px] text-gray-500">Today's Earnings</p>
        <h1 className="text-2xl font-bold text-[#10b981] mt-1">
          ₹2,450
        </h1>
      </div>
    </div>
  );

  // REUSABLE DASHBOARD
  const CaptainStats = () => (
    <div className="bg-[#111827] rounded-[24px] px-4 py-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Dashboard</h2>
        <p className="text-[10px] text-gray-400">Today's Stats</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/5 rounded-2xl py-3 px-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1f2937] flex items-center justify-center">
            <FaRoad />
          </div>
          <h1 className="text-sm font-bold mt-2">128 KM</h1>
          <p className="text-[10px] text-gray-400 mt-1">Distance</p>
        </div>

        <div className="bg-white/5 rounded-2xl py-3 px-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1f2937] flex items-center justify-center">
            <FaClock />
          </div>
          <h1 className="text-sm font-bold mt-2">9.5 Hrs</h1>
          <p className="text-[10px] text-gray-400 mt-1">Online</p>
        </div>

        <div className="bg-white/5 rounded-2xl py-3 px-1">
          <div className="w-9 h-9 mx-auto rounded-xl bg-[#1f2937] flex items-center justify-center">
            <FaStar />
          </div>
          <h1 className="text-sm font-bold mt-2">4.9</h1>
          <p className="text-[10px] text-gray-400 mt-1">Rating</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen md:h-screen overflow-hidden bg-[#f5f7fb]">

      {/* =========================================
          DESKTOP + TABLET LAYOUT
      ========================================= */}

      <div className="hidden md:flex flex-col h-screen w-full">

        {/* TOP NAVBAR */}
        <header className="h-[76px] shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-7 lg:px-10 z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-black rounded-xl flex items-center justify-center">
              <FaLocationArrow className="text-white text-lg" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                texi
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                Move freely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right hidden lg:block">
              <p className="text-sm text-gray-500">
                Captain dashboard
              </p>
              <p className="text-xs text-gray-400">
                Manage your rides and earnings
              </p>
            </div>

            <button
              className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
              aria-label="Captain profile"
            >
              <FaUserCircle className="text-2xl" />
            </button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-h-0 flex">

          {/* MAP */}
          <section className="relative flex-1 min-w-0">
            <div className="absolute inset-0">
              <RideMap
                currentLocation={currentLocation}
                pickupCoordinates={null}
                destinationCoordinates={null}
                routeCoordinates={[]}
              />
            </div>

            {/* MAP STATUS */}
            <div className="absolute top-5 left-5 z-[500] bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <FaCircle className="text-green-500 text-[9px] animate-pulse" />
                <p className="text-sm font-semibold text-gray-900">
                  You are Online
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Waiting for nearby ride requests
              </p>
            </div>

            {/* CURRENT LOCATION STATUS */}
            <div className="absolute bottom-5 left-5 z-[500] bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg">
              <p className="text-xs text-gray-500">
                GPS status
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {currentLocation
                  ? "Location active"
                  : "Waiting for GPS..."}
              </p>
            </div>
          </section>

          {/* RIGHT DASHBOARD */}
          <aside className="w-[340px] lg:w-[390px] xl:w-[420px] shrink-0 bg-[#f8f8f6] border-l border-gray-200 overflow-y-auto">
            <div className="p-5 lg:p-6 space-y-5">

              {/* PANEL HEADER */}
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400 font-semibold">
                  Captain
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Your dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your daily driving overview.
                </p>
              </div>

              {/* PROFILE */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <CaptainProfile />
              </div>

              {/* EARNINGS CARD */}
              <div className="bg-[#111827] rounded-2xl p-5 text-white">
                <p className="text-xs text-gray-400">
                  Today's Earnings
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  ₹2,450
                </h2>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-xs text-gray-400">
                    Earnings overview
                  </p>
                </div>
              </div>

              {/* STATS */}
              <CaptainStats />

              {/* ONLINE STATUS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <FaCircle className="text-green-500 text-xs" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Captain status
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      You are currently online
                    </p>
                  </div>
                </div>
              </div>

              {/* OFFLINE BUTTON */}
              <button className="w-full bg-[#111827] hover:bg-black transition-all text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg">
                Go Offline
              </button>

              <p className="text-xs text-center text-gray-400">
                Drive safely. Your next ride is waiting.
              </p>
            </div>
          </aside>
        </main>
      </div>

      {/* =========================================
          ORIGINAL MOBILE LAYOUT - PRESERVED
      ========================================= */}

      <div className="md:hidden w-full h-screen overflow-hidden">

        {/* MAP SECTION */}
        <div className="w-full h-[60%] relative overflow-hidden">

          <div className="absolute inset-0 z-0">
            <RideMap
              currentLocation={currentLocation}
              pickupCoordinates={null}
              destinationCoordinates={null}
              routeCoordinates={[]}
            />
          </div>

          {/* NAVBAR */}
          <div className="absolute top-0 left-0 w-full px-4 pt-5 flex items-center justify-between z-20">
            <div className="bg-[#111827]/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
              <h1 className="text-white text-lg font-bold tracking-wide">
                Texi
              </h1>
            </div>

            <button className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-[#111827] text-xl shadow-lg">
              <FaUserCircle />
            </button>
          </div>

          {/* ONLINE STATUS */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-[#111827]/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <FaCircle className="text-green-400 text-[8px] animate-pulse" />
              <p className="text-white text-xs font-medium">
                You are Online
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM DASHBOARD */}
        <div className="w-full h-[50%] bg-yellow-300 rounded-t-[30px] -mt-6 flex flex-col gap-4 relative bottom-0 z-30 px-4 pt-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">

          {/* CAPTAIN INFO */}
          <CaptainProfile />

          {/* DASHBOARD */}
          <div className="mt-4">
            <CaptainStats />
          </div>

          {/* OFFLINE BUTTON */}
          <button className="w-full mt-3 bg-[#111827] hover:bg-black transition-all text-white py-2.5 rounded-2xl text-sm font-semibold shadow-lg">
            Go Offline
          </button>
        </div>
      </div>

      {/* =========================================
          NEW RIDE POPUP
      ========================================= */}

      <div
        ref={ridePOPref}
        className="fixed translate-y-full bottom-0 left-0 w-full md:left-auto md:right-6 md:w-[420px] md:max-w-[calc(100%-3rem)] z-[1000]"
      >
        <POPup
          setridePOPup={setridePOPup}
          setPickupPanel={setPickupPanel}
          confirmRide={confirmRide}
          ride={ride}
        />
      </div>

      {/* =========================================
          CAPTAIN PICKUP POPUP
      ========================================= */}

      <div
        ref={pickupPOPref}
        className="fixed translate-y-full bottom-0 left-0 w-full md:left-auto md:right-6 md:w-[420px] md:max-w-[calc(100%-3rem)] z-40"
      >
        <CaptainPickupPOP
          setridePOPup={setridePOPup}
          setPickupPanel={setPickupPanel}
          setConfirmRidePanel={setConfirmRidePanel}
          ride={ride}
        />
      </div>

      {/* =========================================
          CONFIRM RIDE POPUP
      ========================================= */}

      <div
        ref={confirmRidePOPref}
        className="fixed translate-y-full bottom-0 left-0 w-full md:left-auto md:right-6 md:w-[420px] md:max-w-[calc(100%-3rem)] z-50"
      >
        <ConfirmRidePOP
          setConfirmRidePanel={setConfirmRidePanel}
          setPickupPanel={setPickupPanel}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
