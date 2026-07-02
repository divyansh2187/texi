import React from "react";
import { CiUser } from "react-icons/ci";
import { useState, useRef,useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SlArrowDown } from "react-icons/sl";


import Suggestion from "../components/Suggestion";
import VehiclePanel from "../components/VehicalPanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/Looking";
import WaitingForDriver from "../components/waiting";
import axios from "axios";


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
 

  const panelref = useRef(null);
  const vehicalpanelref = useRef(null);
  const panelcloseref = useRef(null);
  const confirmrideref = useRef(null);
  const lookingref = useRef(null);
  const waitingref = useRef(null);



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
    let watchId;

    const startTracking = () => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported");
            return;
        }

        watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                console.log("GPS:", lat, lng);
                console.log("Accuracy:", accuracy);

                // Ignore very inaccurate locations
                if (accuracy > 100) {
                    console.log("Waiting for better GPS signal...");
                    return;
                }

                setCurrentLocation({ lat, lng });

                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BASEURL}/map/reverse-geocode`,
                        {
                            params: { lat, lng },
                            withCredentials: true,
                        }
                    );

                    setPickup(response.data.data.address);
                } catch (err) {
                    console.log("Reverse Geocode Error:", err);
                }
            },
            (error) => {
                console.log("Location Error:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    startTracking();

    return () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
        }
    };
}, []);




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
                onClick={() => setpanelOpen(true)}
              />

              <input
                type="text"
                className="p-3 bg-gray-100 rounded-lg w-full text-center"
                placeholder="enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onClick={() => setpanelOpen(true)}
              />
            </form>
          </div>
        </div>

        {/* Suggestion Panel */}
        <div
          ref={panelref}
          className="w-full bg-gray-100 p-1 h-0 overflow-hidden"
        >
          <Suggestion
            vehiclepanel={vehicalpanel}
            setvehicalpanel={setvehicalpanel}
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
        />
      </div>

      <div
        ref={confirmrideref}
        className="fixed w-full h-[52%]  v-[60] z-20 bottom-0 translate-y-full px-3 pb-3 "
      >
        <ConfirmRide setConfirmRide={setConfirmRide1}
          selectedVehicle={selectedVehicle} setLookingForDriver={setLookingForDriver} 
          pickup={pickup} destination={destination} />
      </div>
      <div ref={lookingref} className="w-full translate-y-full h-[52%] fixed v-[60] bottom-0 z-30 px-3 pb-3">
        <LookingForDriver selectedVehicle={selectedVehicle} setLookingForDriver={setLookingForDriver} />
      </div>
      <div  ref={waitingref} className="w-full h-[55%]  fixed v-[60] bottom-0 z-10 px-3 pb-3 ">
        <WaitingForDriver pickup={pickup} destination={destination} selectedVehicle={selectedVehicle} 
        setDriverFound={setDriverFound} />
      </div>
    </div>
  );
};

export default Homepage;


