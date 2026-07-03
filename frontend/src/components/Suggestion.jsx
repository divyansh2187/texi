import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaLocationArrow,
} from "react-icons/fa";


const Suggestion = ( {
  suggestions,
  activeField,
  setPickup,
  setDestination,
  setpanelOpen
}) => {

  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4">

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden">

        {/* Header */}
        <div className="text-center pt-3 pb-3">



          <p className="text-sm text-gray-400 mt-1">
            Find your destination faster with Texi
          </p>
        </div>

        {/* Suggestions */}
        <div className="pb-2">

          {suggestions.map((item) => (
            <div
              key={item.place_id}
              onClick={() => {
                setSelected(item.place_id);
                if (activeField === "pickup") {
                  setPickup(item.title);
                } else if (activeField === "destination") {
                  setDestination(item.title);
                }
              }}
              className={`group flex items-center justify-between px-5 py-4 
              transition-all duration-300 cursor-pointer
              ${
                selected === item.place_id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >

              {/* Left */}
              <div className="flex items-center gap-4 min-w-0">

                {/* Icon */}
                <div
                  className={`min-w-[54px] h-[54px] rounded-2xl
                  flex items-center justify-center text-lg transition-all duration-300
                  ${
                    selected === item.place_id
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800 group-hover:bg-black group-hover:text-white"
                  }`}
                >
                  <FaMapMarkerAlt />
                </div>

                {/* Text */}
                <div className="min-w-0">

                  <h2 className="text-[15px] sm:text-[17px] font-semibold text-gray-900 truncate">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500 truncate mt-1">
                    {item.address}
                  </p>

            
        
                </div>
              </div>

              {/* Right Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                ${
                  selected === item.place_id
                    ? "bg-black"
                    : "bg-gray-300 group-hover:bg-black"
                }`}
              ></div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Suggestion;