import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const AuthRedirect = () => {

   const [loading, setLoading] = useState(true);
   const [role, setRole] = useState(null);

   useEffect(() => {

      const checkAuth = async () => {

         try {

            const response =
               await axiosInstance.get("/auth/check");

            setRole(response.data.role);

         } catch (err) {

            setRole(null);

         } finally {

            setLoading(false);

         }

      };

      checkAuth();

   }, []);

   if (loading) {
      return <div>Loading...</div>;
   }

   // Not logged in
   if (!role) {
      console.log("User not authenticated, redirecting to login.");
      return <Navigate to="/login" replace />;
   }

   // User logged in
   if (role === "user") {
      console.log("User authenticated, redirecting to UserHome.");
      return <Navigate to="/UserHome" replace />;
   }

   // Captain logged in
   if (role === "captain") {
      console.log("Captain authenticated, redirecting to CaptainHome.");
      return <Navigate to="/CaptainHome" replace />;
   }

   console.log("Unexpected role, redirecting to login.");
   return <Navigate to="/login" replace />;

};

export default AuthRedirect;