const userModel = require("../models/UserModel");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body;

  const isUserExist = await userModel.findOne({ email });

  if (isUserExist) {
    return res.status(400).json({ massage: "User already exist" });
  }

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashPassword,
  });

  const token = user.generateToken();

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
    })
    .json({ status: "success", user, token });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body);
  console.log(errors.array());

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = user.generateToken();

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: "lax",
    })
    .json({ status: "success", user, token });
};

module.exports.GetUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });

  res.status(200).json({ message: "logged out" });
};
