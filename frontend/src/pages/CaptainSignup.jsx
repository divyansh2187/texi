// Remove the dropdown <select> for vehicleType and keep only the radio buttons

import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { CaptainDataContext } from "../context/CaptainContext";
import { registerCaptain } from "../api/captainApi";

const CaptainSignup = () => {
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [color, setColor] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const CaptainData = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password: pass,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType,
      },
    };

    try {
      const response = await registerCaptain(CaptainData);

      if (response.status === "success") {
        setCaptain(response.captain);
        navigate("/CaptainHome");
      }
    } catch (err) {
      console.log(err);
    }

    setFirstname("");
    setLastname("");
    setemail("");
    setpass("");
    setColor("");
    setPlate("");
    setCapacity("");
    setVehicleType("");
  };

  return (
    <div className="max-full mx-auto h-screen flex flex-col gap-3 lg:w-full items-center">
      <div className="w-full bg-black px-4 py-4 text-white">
        <h1 className="text-3xl font-light">texi</h1>
      </div>

      <div className="lg:bg-white h-full lg:w-[30%] w-full px-5 py-4 flex flex-col justify-between lg:rounded-xl lg:scale-85">
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <h3 className="text-2xl font-semibold">Register as Captain</h3>

          <div className="flex gap-3">
            <input
              className="w-1/2 py-2 bg-[#EEEEEE] px-4 rounded text-lg"
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              placeholder="First name"
            />

            <input
              className="w-1/2 py-2 bg-[#EEEEEE] px-4 rounded text-lg"
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              placeholder="Last name"
            />
          </div>

          <input
            className="w-full py-2 bg-[#EEEEEE] px-4 rounded text-lg"
            required
            value={email}
            type="email"
            onChange={(e) => setemail(e.target.value)}
            placeholder="captain@example.com"
          />

          <input
            className="w-full py-2 bg-[#EEEEEE] px-4 rounded text-lg"
            required
            value={pass}
            onChange={(e) => setpass(e.target.value)}
            type="password"
            placeholder="password"
          />

        <div className="flex flex-col gap-2">
  <label className="text-lg font-medium mb-1">Vehicle Type</label>

  <div className="flex gap-6 justify-center text-5xl">

    <label
      className={`p-3 rounded-xl cursor-pointer transition ${
        vehicleType === "car" ? "bg-black scale-110   text-white" : "bg-gray-100"
      }`}
    >
      <input
        type="radio"
        name="vehicleType"
        value="car"
        className="hidden"
        checked={vehicleType === "car"}
        onChange={(e) => setVehicleType(e.target.value)}
        required
      />
      🚗
    </label>

    <label
      className={`p-3 rounded-xl cursor-pointer transition ${
        vehicleType === "motorcycle" ? "bg-black scale-110 text-white" : "bg-gray-100"
      }`}
    >
      <input
        type="radio"
        name="vehicleType"
        value="motorcycle"
        className="hidden"
        checked={vehicleType === "motorcycle"}
        onChange={(e) => setVehicleType(e.target.value)}
        required
      />
      🏍️
    </label>

    <label
      className={`p-3 rounded-xl cursor-pointer transition ${
        vehicleType === "auto" ? "bg-black scale-110 text-white" : "bg-gray-100"
      }`}
    >
      <input
        type="radio"
        name="vehicleType"
        value="auto"
        className="hidden"
        checked={vehicleType === "auto"}
        onChange={(e) => setVehicleType(e.target.value)}
        required
      />
      🛺
    </label>

  </div>
</div>

          {/* Vehicle Details Card */}
          {vehicleType && (
            <div className="bg-white shadow rounded-xl p-4 flex flex-col gap-3 border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Vehicle Details</h4>
              <input
                className="w-full py-2 bg-[#EEEEEE] px-4 rounded text-lg"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                type="text"
                placeholder="Vehicle color"
              />
              <input
                className="w-full py-2 bg-[#EEEEEE] px-4 rounded text-lg"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                type="text"
                placeholder="Plate number"
              />
              <input
                className="w-full py-2 bg-[#EEEEEE] px-4 rounded text-lg"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                type="number"
                placeholder="Capacity"
                min="1"
              />
            </div>
          )}

          <button className="w-full py-3 rounded text-xl bg-black text-white hover:bg-gray-900 transition">
            Register Captain
          </button>
          <p className="text-center mt-2">
            Already have a captain account?{" "}
            <NavLink className="text-amber-400" to={"/captain-login"}>
              Login
            </NavLink>
          </p>

          <div className="flex items-center gap-3 my-2">
            <div className="h-[1px] bg-gray-300 w-full"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-[1px] bg-gray-300 w-full"></div>
          </div>

          <button
            type="button"
            className="w-full py-3 bg-[#EEEEEE] rounded text-lg flex justify-center items-center gap-3 hover:bg-gray-100"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full py-3 bg-[#EEEEEE] rounded text-lg flex justify-center items-center gap-3 hover:bg-gray-100"
          >
            <FaApple size={22} />
            Continue with Apple
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaptainSignup;
