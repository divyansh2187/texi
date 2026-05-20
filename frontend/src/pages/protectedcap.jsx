import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const CaptainProtected = ({ children }) => {

  const [auth, setAuth] = useState(null);

  useEffect(() => {

    const checkCaptainAuth = async () => {

      try {

        await axiosInstance.get("/captain/auth-check");

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