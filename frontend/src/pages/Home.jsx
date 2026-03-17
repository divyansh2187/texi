import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Home = () => {

  return (
    <div>
      <div
        className="
        object-center bg-bottom bg-no-repeat bg-cover
        bg-[url(https://images.unsplash.com/photo-1724250251649-54b24386ae57?q=80&w=735&auto=format&fit=crop)]
        lg:bg-[url(https://images.unsplash.com/photo-1755227832786-8f3cc807d724?q=80&w=1025&auto=format&fit=crop)]
        h-screen w-full flex flex-col justify-between lg:justify-center
        pt-4 font-[Inter]
        "
      >
        {/* Logo */}
        <h1 className="font-light text-black text-3xl sm:text-4xl ml-4 lg:hidden">
          Texi
        </h1>

        {/* Card */}
        <div
          className="
          bg-white px-5 py-6 rounded-t-3xl shadow-lg flex flex-col gap-4
          lg:w-[400px] lg:py-3 lg:mx-auto lg:rounded-2xl lg:text-center
          lg:bg-transparent
          "
        >
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Get started with Texi
          </h2>

          <NavLink
            to={"/login"}
            className="w-full bg-black text-white text-lg sm:text-xl py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition"
          >
            Continue <FiArrowRight size={22} />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
