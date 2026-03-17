import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const UserLogin = () => {
  const [email, setemail] = useState("")
  const [pass, setpass] = useState("")
  const [UserData, setUserData] = useState({})


  const submitHandler =(e)=>{
    e.preventDefault();
    setUserData({
      email:email,
      password:pass
    })

    setemail('');
    setpass('');
  
    console.log(email , pass);

  }
  return (
    <div className=" max-full mx-auto h-screen flex flex-col  gap-3
    justify-center lg:w-full  items-center">
      <div className="w-full bg-black px-4 py-4 text-white ">
        <h1 className="text-3xl font-light " >texi</h1>
      </div>

      <div className="lg:bg-white h-full  lg:w-[30%]  w-full px-5 py-4 flex flex-col justify-between lg:rounded-xl lg:scale-90">

        <form className="flex flex-col gap-4"  onSubmit={
          (e)=>{
            submitHandler(e)

          }
        }>
    
          <h3 className="text-2xl font-semibold">What's your email</h3>
          <input
            className="w-full py-2 bg-[#EEEEEE] px-4  rounded text-lg placeholder:text-base"
            required
            value={email}
            type="email"
            onChange={ (e)=>{
              setemail(e.target.value);
            }
          }
            placeholder="email@example.com"
            />

          <h3 className="text-2xl font-semibold">Enter your password</h3>
          <input
            className="w-full py-2 bg-[#EEEEEE] px-4  rounded text-lg placeholder:text-base"
            required
             value={pass}
            onChange={ (e)=>{
              setpass(e.target.value);
            }
          }
            type="password"
            placeholder="password"
            />

          <button
            className="w-full py-3 rounded text-xl bg-black text-white hover:bg-gray-900 transition"
            >
            Login
          </button>

          <p>
            new here ?{" "}
            <NavLink className="text-amber-400" to={"/signup"}>
              create an new account
            </NavLink>
          </p>
        </form>

        <div>
          <NavLink
            to={"/captain-login"}
            className="w-full py-3 rounded flex justify-center text-xl mb-6 bg-amber-400 text-white hover:bg-gray-900 transition lg:mt-6"
          >
            🚕 login as an captain
          </NavLink>
        </div>

            </div>
      </div>

  );
};

export default UserLogin;