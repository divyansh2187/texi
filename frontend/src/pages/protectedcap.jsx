import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";


const CaptainProtected = ({ children }) => {
  const { setCaptain } = useContext(CaptainDataContext);

  const [auth, setAuth] = useState(null);

  useEffect(() => {

    const checkCaptainAuth = async () => {

      try {

        const response = await axiosInstance.get("/captain/auth-check");
        setCaptain(response.data.captain);  
        setAuth(true);

      } catch (err) {

        setAuth(false);

      }

    };

    checkCaptainAuth();

  }, []);

  // While checking authentication
  if (auth === null) {
    return <div>Loading...</div>;
  }

  // If authenticated → show protected page
  // Else → redirect to login
  return auth
    ? children
    : <Navigate to="/captain-login" replace />;

};

export default CaptainProtected;