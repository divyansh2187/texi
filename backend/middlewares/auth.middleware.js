const userModel = require("../models/UserModel");
const blacklist = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/CaptianModel");


// ================= USER AUTH =================

module.exports.authUser = async (req, res, next) => {

  try {

    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message: "Unauthorized"
      });

    }

    // CHECK BLACKLIST
    const isBlacklisted =
      await blacklist.findOne({ token });

    if (isBlacklisted) {

      return res.status(401).json({
        message: "Token blacklisted"
      });

    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ROLE CHECK
    if (decoded.role !== "user") {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    // FIND USER
    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    req.user = user;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Unauthorized"
    });

  }

};


// ================= CAPTAIN AUTH =================

module.exports.authCaptain = async (req, res, next) => {

  try {

    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message: "Unauthorized"
      });

    }

    // CHECK BLACKLIST
    const isBlacklisted =
      await blacklist.findOne({ token });

    if (isBlacklisted) {

      return res.status(401).json({
        message: "Token blacklisted"
      });

    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ROLE CHECK
    if (decoded.role !== "captain") {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    // FIND CAPTAIN
    const captain = await captainModel
      .findById(decoded._id)
      .select("-password");

    if (!captain) {

      return res.status(404).json({
        message: "Captain not found"
      });

    }

    req.captain = captain;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Unauthorized"
    });

  }

};