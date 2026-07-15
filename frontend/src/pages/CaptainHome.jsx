import React from "react";
import {
  FaUserCircle,
  FaRoad,
  FaClock,
  FaStar,
  FaCircle,
} from "react-icons/fa";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import POPup from "../components/POPup";
import ConfirmRidePOP from "../components/confirmridePOP";
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useEffect } from "react";
import { SocketContext } from "../context/SocketContext";



const CaptainHome = () => {
  const { captain  } = useContext(CaptainDataContext);
  const [ridePOPup, setridePOPup] = useState(true)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const { sendMessage , receiveMessage } = useContext(SocketContext);



  const ridePOPref = useRef()
  const confirmRidePOPref = useRef()

  useGSAP(() => {
    if (ridePOPup) {
      gsap.to(ridePOPref.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(ridePOPref.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [ridePOPup]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePOPref.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(confirmRidePOPref.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [confirmRidePanel]);


useEffect(() => {
    if (!captain?._id) return;

    sendMessage("joinRoom", {
        userId: captain._id,
        userType: "captain",
    });

    const updateCaptainLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                sendMessage("update-location-captain", {
                    captainId: captain._id,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                });
            },
            (error) => {
                console.error("Location error:", error);
            },
            {
                enableHighAccuracy: true,
            }
        );
    };

    // Send immediately
    updateCaptainLocation();

    // Then every 5 seconds
    const locationInterval = setInterval(updateCaptainLocation, 5000);

    return () => {
        clearInterval(locationInterval);
    };
}, [captain, sendMessage]);


  





  return (
    <div className="w-full h-screen overflow-hidden bg-[#f5f7fb]">

      {/* ================= MAP SECTION ================= */}
      <div className="w-full h-[60%] relative overflow-hidden">

        {/* Map */}
        <img
          className="w-full h-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* ================= NAVBAR ================= */}
        <div className="absolute top-0 left-0 w-full px-4 pt-5 flex items-center justify-between z-20">

          {/* Logo */}
          <div className="bg-[#111827]/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
            <h1 className="text-white text-lg font-bold tracking-wide">
              Texi
            </h1>
          </div>

          {/* User Icon */}
          <button className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-[#111827] text-xl shadow-lg">
            <FaUserCircle />
          </button>
        </div>

        {/* ================= ONLINE STATUS ================= */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">

          <div className="bg-[#111827]/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">

            <FaCircle className="text-green-400 text-[8px] animate-pulse" />

            <p className="text-white text-xs font-medium">
              You are Online
            </p>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="w-full h-[50%] bg-yellow-300 rounded-t-[30px] -mt-6 flex flex-col gap-4 relative bottom-0 z-30 px-4 pt-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">

        {/* ================= TOP INFO ================= */}
        <div className="flex items-center justify-between ">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">

            {/* Captain Image */}
            <img
              className="w-14 h-14 rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"
              alt=""
            />

            {/* Details */}
            <div className="min-w-0 ">

              <h1 className="text-lg font-bold text-[#111827] truncate capitalize">
                 {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </h1>

              <p className="text-xs text-gray-500">
                Premium Driver
              </p>
            </div>
          </div>

          {/* Earnings */}
          <div className="text-right">

            <p className="text-[10px] text-gray-500">
              Today's Earnings
            </p>

            <h1 className="text-2xl font-bold text-[#10b981] mt-1">
              ₹2,450
            </h1>
          </div>
        </div>

        {/* ================= DASHBOARD ================= */}
        <div className="mt-4 bg-[#111827] rounded-[24px] px-3 py-3 text-white">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">

            <h2 className="text-sm font-semibold">
              Dashboard
            </h2>

            <p className="text-[10px] text-gray-400">
              Today's Stats
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">

            {/* Distance */}
            <div className="bg-white/5 rounded-2xl py-3 px-1">

              <div className="w-8 h-8 mx-auto rounded-lg bg-[#1f2937] flex items-center justify-center">
                <FaRoad className="text-xs" />
              </div>

              <h1 className="text-sm font-bold mt-2">
                128 KM
              </h1>

              <p className="text-[9px] text-gray-400 mt-1">
                Distance
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white/5 rounded-2xl py-3 px-1">

              <div className="w-8 h-8 mx-auto rounded-lg bg-[#1f2937] flex items-center justify-center">
                <FaClock className="text-xs" />
              </div>

              <h1 className="text-sm font-bold mt-2">
                9.5 Hrs
              </h1>

              <p className="text-[9px] text-gray-400 mt-1">
                Online
              </p>
            </div>

            {/* Rating */}
            <div className="bg-white/5 rounded-2xl py-2 px-1">

              <div className="w-4 h-8 mx-auto rounded-lg bg-[#1f2937] flex items-center justify-center">
                <FaStar className="text-xs" />
              </div>

              <h1 className="text-sm font-bold mt-2">
                4.9
              </h1>

              <p className="text-[9px] text-gray-400 mt-1">
                Rating
              </p>
            </div>

          </div>
        </div>

        {/* ================= BUTTON ================= */}
        <button className="w-full mt-3 bg-[#111827] hover:bg-black transition-all text-white py-2.5 rounded-2xl text-sm font-semibold shadow-lg">
          Go Offline
        </button>
      </div>
      <div ref={ridePOPref} className="fixed  translate-y-full bottom-0 left-0 w-full  z-30">
        <POPup setridePOPup={setridePOPup} setConfirmRidePanel={setConfirmRidePanel} />
      </div>

      <div
        ref={confirmRidePOPref}
        className="fixed translate-y-full bottom-0 left-0 w-full  z-50"
      >
        <ConfirmRidePOP setridePOPup={setridePOPup} setConfirmRidePanel={setConfirmRidePanel} />
      </div>


    </div>
  );
};

export default CaptainHome;