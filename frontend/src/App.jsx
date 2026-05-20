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
import CaptainProtected from "./pages/protectedcap";
import CaptainHome from "./pages/CaptainHome";
import AuthRedirect from "./components/AuthRedirect";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />



      <Route path="/UserHome" element={<Protected> <Homepage /></Protected>} />
      <Route path="/riding" element={<Protected> <Riding /></Protected>} />
      <Route path="*" element={<UserLogin />} />


      <Route path="/CaptainHome" element={<CaptainProtected> <CaptainHome /></CaptainProtected>} />
      <Route path="/captain-Riding" element={<CaptainProtected> <CaptainRiding /></CaptainProtected> }/>

    </Routes>
  );
}

export default App;
