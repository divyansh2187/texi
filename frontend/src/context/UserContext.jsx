import React, { useState } from "react";
import { createContext } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {


    const [User, setUser] = useState({
        email:'',
        fullname:{
            firstname:"",
            lastname:"",
        }
    })
  return (
    <div>
      <UserDataContext.Provider value={[User , setUser]}   >
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
