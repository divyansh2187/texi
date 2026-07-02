import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaLocationArrow,
} from "react-icons/fa";

const suggestions = [
  {
    id: 1,
    title: "Mayo College",
    address: "Mayo College Rd, Ajmer",
    type: "Recent",
  },
  {
    id: 2,
    title: "Ana Sagar Lake",
    address: "Vaishali Nagar, Ajmer",
    type: "Popular",
  },
  {
    id: 3,
    title: "Ajmer Railway Station",
    address: "Station Rd, Ajmer",
    type: "Nearby",
  },
  {
    id: 4,
    title: "Dargah Sharif",
    address: "Dargah Bazaar, Ajmer",
    type: "Popular",
  },
  {
    id: 5,
    title: "Pushkar Bus Stand",
    address: "Pushkar Rd, Ajmer",
    type: "Recent",
  },
];



const Suggestion = ({ vehiclepanel, setvehicalpanel }) => {

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
              key={item.id}
              onClick={() => {
                setSelected(item.id);
                setvehicalpanel(true);
              }}
              className={`group flex items-center justify-between px-5 py-4 
              transition-all duration-300 cursor-pointer
              ${
                selected === item.id
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
                    selected === item.id
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

                  {/* Extra Info */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaClock className="text-[10px]" />
                      <span>5 min away</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaLocationArrow className="text-[10px]" />
                      <span>{item.type}</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                ${
                  selected === item.id
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