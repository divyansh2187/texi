import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainLogin from "./pages/CaptainLogin";
import Homepage from "./pages/homepage";
import Protected from "./pages/protected";
import NotFound from "./pages/Notfound";
import { LoginUser } from "./api/AuthApi";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />

      <Route path="/home" element={<Protected> <Homepage /></Protected> } />
      <Route path="*" element={<UserLogin />} />

    </Routes>
  );
}

export default App;
