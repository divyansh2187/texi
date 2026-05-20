import React, { useState } from "react";
import { NavLink , useNavigate } from "react-router-dom";
import { loginCaptain } from "../api/captainApi";
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
 const { setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const CaptainData = {
      email: email,
      password: pass,
    };

    try{
      const response = await loginCaptain(CaptainData);
      if(response.status === "success"){
        setCaptain(response.data);
        navigate("/CaptainHome");
      }

    }
     catch(error){
        console.log(error);
      }

    setEmail("");
    setPass("");
  };

  return (
    <div className="max-full mx-auto h-screen flex flex-col gap-3 lg:gap-1 justify-center lg:w-full items-center">
      
      {/* Navbar */}
      <div className="w-full bg-black px-4 py-4 text-white">
        <h1 className="text-3xl font-light">texi</h1>
      </div>

      {/* Login Card */}
      <div className="lg:bg-white h-full lg:w-[30%] w-full px-5 py-4 flex flex-col justify-between lg:rounded-xl lg:scale-90">

        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          
          <h3 className="text-2xl font-semibold">Captain Email</h3>
          <input
            className="w-full py-2 bg-[#EEEEEE] px-4  rounded text-lg placeholder:text-base"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="captain@email.com"
          />

          <h3 className="text-2xl font-semibold">Enter your password</h3>
          <input
            className="w-full py-2 bg-[#EEEEEE] px-4  rounded text-lg placeholder:text-base"
            type="password"
            required
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="password"
          />

          <button className="w-full py-3 rounded text-xl bg-black text-white hover:bg-gray-900 transition">
            Captain Login
          </button>

          <p>
            Want to drive with us?{" "}
            <NavLink className="text-amber-400" to={"/captain-signup"}>
              Register as Captain
            </NavLink>
          </p>

        </form>

        <div>
          <NavLink
            to={"/login"}
            className="w-full py-3 rounded flex justify-center text-xl mb-6 bg-green-400 text-white hover:bg-gray-900 transition lg:mt-6"
          >
            👤 Login as User
          </NavLink>
        </div>

      </div>
    </div>
  );
};

export default CaptainLogin;