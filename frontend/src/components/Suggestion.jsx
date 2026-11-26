
import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const Suggestion = ({
  suggestions,
  activeField,
  setPickup,
  setDestination,
  setpanelOpen,
}) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4 md:max-w-full md:px-0">

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden md:rounded-2xl md:shadow-sm">

        {/* Header */}
        <div className="text-center pt-3 pb-3 md:pt-2 md:pb-2">
          <p className="text-sm text-gray-400 mt-1 md:text-xs">
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
                md:px-3 md:py-3
                ${
                  selected === item.place_id
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
            >

              {/* Left */}
              <div className="flex items-center gap-4 min-w-0 md:gap-3">

                {/* Icon */}
                <div
                  className={`min-w-[54px] h-[54px] rounded-2xl
                    flex items-center justify-center text-lg transition-all duration-300
                    md:min-w-[42px] md:w-[42px] md:h-[42px] md:rounded-xl md:text-base
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

                  <h2 className="text-[15px] sm:text-[17px] font-semibold text-gray-900 truncate md:text-sm">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500 truncate mt-1 md:text-xs">
                    {item.address}
                  </p>

                </div>
              </div>

              {/* Right Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shrink-0
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
