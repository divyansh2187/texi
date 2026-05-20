import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/AuthApi";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const navigate = useNavigate();
  const { User, setUser } = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password: pass,
    };

    try {
      const data = await registerUser(newUser);

      if (data.status === "success") {
        setUser(data.user);
        navigate("/UserHome");
      }
    } catch (err) {
      console.log(err);
    }

    setFirstname("");
    setLastname("");
    setemail("");
    setpass("");
  };

  return (
    <div className="max-full mx-auto h-screen flex flex-col gap-3  lg:w-full items-center">
      {/* top bar */}
      <div className="w-full bg-black px-4 py-4 text-white">
        <h1 className="text-3xl font-light">texi</h1>
      </div>

      <div className="lg:bg-white h-full lg:w-[30%] w-full px-5 py-4 flex flex-col justify-between lg:rounded-xl lg:scale-85">
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <h3 className="text-2xl font-semibold">Create your account</h3>

          {/* first + last name */}
          <div className="flex gap-3">
            <input
              className="w-1/2 py-2 bg-[#EEEEEE] px-4  rounded text-lg"
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              placeholder="First name"
            />

            <input
              className="w-1/2 py-2 bg-[#EEEEEE] px-4  rounded text-lg"
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
              placeholder="Last name"
            />
          </div>

          {/* email */}
          <input
            className="w-full py-2 bg-[#EEEEEE] px-4  rounded text-lg"
            required
            value={email}
            type="email"
            onChange={(e) => setemail(e.target.value)}
            placeholder="email@example.com"
          />

          {/* password */}
          <input
            className="w-full py-2 bg-[#EEEEEE] px-4  rounded text-lg"
            required
            value={pass}
            onChange={(e) => setpass(e.target.value)}
            type="password"
            placeholder="password"
          />

          {/* signup button */}
          <button className="w-full py-3 rounded text-xl bg-black text-white hover:bg-gray-900 transition">
            Sign Up
          </button>

          {/* divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-[1px] bg-gray-300 w-full"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-[1px] bg-gray-300 w-full"></div>
          </div>

          {/* google button */}
          <button
            type="button"
            className="w-full py-3  bg-[#EEEEEE] rounded text-lg  flex justify-center items-center gap-3 hover:bg-gray-100"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          {/* apple button */}
          <button
            type="button"
            className="w-full py-3  bg-[#EEEEEE] rounded text-lg  flex justify-center items-center gap-3 hover:bg-gray-100"
          >
            <FaApple size={22} />
            Continue with Apple
          </button>

          <p className="text-center mt-2">
            Already have an account?{" "}
            <NavLink className="text-amber-400" to={"/login"}>
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
