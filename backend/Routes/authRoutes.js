const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const userModel = require("../models/UserModel");
const captainModel = require("../models/CaptianModel");

router.get("/check", async (req, res) => {

   const token = req.cookies.token;
   console.log("Checking authentication with token:", token);
  

   if (!token) {
      return res.status(401).json({
         authenticated: false
      });
   }

   try {

      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET
      );

      // USER
      if (decoded.role === "user") {

         const user = await userModel.findById(decoded._id);
         console.log(user);

         return res.json({
            authenticated: true,
            role: "user",
            user
         });

      }

      // CAPTAIN
      if (decoded.role === "captain") {

         const captain = await captainModel.findById(decoded._id);
         console.log(captain);

         return res.json({
            authenticated: true,
            role: "captain",
            captain
         });

      }

      return res.status(401).json({
         authenticated:false
      });

   } catch (err) {

      return res.status(401).json({
         authenticated:false
      });

   }

});

module.exports = router;