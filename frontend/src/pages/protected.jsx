import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";





const Protected = ({ children }) => {

  const [auth, setAuth] = useState(null);
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {

    const checkUserAuth = async () => {

      try {

        const res = await axiosInstance.get("/users/auth-check");

        setUser(res.data.user);
        setAuth(true);

      } catch (err) {

        setAuth(false);

      }

    };

    checkUserAuth();

  }, []);

  // While checking authentication
  if (auth === null) {
    return <div>Loading...</div>;
  }

  // If authenticated → show protected page
  // Else → redirect to login
  return auth
    ? children
    : <Navigate to="/login" replace />;

};

export default Protected;