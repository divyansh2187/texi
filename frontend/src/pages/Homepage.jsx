import React from "react";
import { CiUser } from "react-icons/ci";
import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SlArrowDown } from "react-icons/sl";
import { useContext } from "react";

import Suggestion from "../components/Suggestion";
import VehiclePanel from "../components/VehicalPanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/Looking";
import WaitingForDriver from "../components/waiting";
import axios from "axios";
import { getRideEstimate } from "../api/map.api";
import { createRide } from "../api/ride.api";
import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";


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
  const [activeField, setActiveField] = useState(""); // "pickup" or "destination"
  const [rideEstimate, setRideEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const panelref = useRef(null);
  const vehicalpanelref = useRef(null);
  const panelcloseref = useRef(null);
  const confirmrideref = useRef(null);
  const lookingref = useRef(null);
  const waitingref = useRef(null);
  const { User } = useContext(UserDataContext);
  const { sendMessage , receiveMessage } = useContext(SocketContext);


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

  useGSAP(() => {
    if (driverFound) {
      gsap.to(waitingref.current, {
        hidden: false,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(waitingref.current, {
        hidden: true,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  }, [driverFound]);

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
          },
        );

        setSuggestions(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pickup, destination, activeField]);

  {/* Function to handle getting fare duration and distance */ }
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


  {/* Function to handle creating a ride */ }
  const handleCreateRide = async () => {
    try {
      const rideData = {
        pickup,
        destination,
        vehicleType: selectedVehicle,
        fare: rideEstimate?.data?.fare[selectedVehicle] || 0,
      };
      const result = await createRide(rideData);
      console.log("Ride created successfully:", result);
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };


  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Accuracy:", accuracy, "meters");

        // Ignore very inaccurate locations
        if (accuracy > 100) {
          console.warn("Location accuracy is too low.");
          return;
        }

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
        } catch (err) {
          console.error(err);
        }
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);



useEffect(() => {
    if (!User?._id) return;

    console.log("Joining socket:", User._id);

    sendMessage("joinRoom", {
        userId: User._id,
        userType: "user",
    });
}, [User]);

  return (
    <div className="">
      {/* Top Navbar */}
      <div className="w-full mt-1 ml-1 flex absolute justify-between">
        <h1 className="font-light text-black text-3xl sm:text-4xl">Texi</h1>

        <div className="mr-2">
          <CiUser className="text-4xl" />
        </div>
      </div>

      {/* Background */}
      <img
        className="w-screen h-screen object-cover"
        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        alt=""
      />

      {/* Main Panel */}
      <div className="h-screen w-full top-0 flex flex-col justify-end absolute">
        <div className="p-2 h-[30%] relative w-full bg-white rounded-t-4xl">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold ml-5 mt-4">Find a ride</h1>

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
                onClick={
                  () => {
                    handleFindRide();
                    setpanelOpen(false);
                  }
                }
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
          className="w-full bg-gray-100 p-1 h-0 overflow-hidden"
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
        className="fixed w-full h-[52%]  v-[60] z-20 bottom-0 translate-y-full px-3 pb-3 "
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

      {/* Waiting For Driver Panel */}
      <div
        ref={waitingref}
        className="w-full h-[55%]  fixed v-[60] bottom-0 z-10 px-3 pb-3 "
      >
        <WaitingForDriver
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
          setDriverFound={setDriverFound}
        />
      </div>
    </div>
  );
};

export default Homepage;
