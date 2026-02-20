const exprees = require("express");
const router = exprees.Router();
const { body } = require("express-validator");
const userController = require("../Controllers/user.controller");


router.post("/register", [
    body("email").isEmail().withMessage("please enter a valid email"),
    body("fullname.firstName").isLength({ min: 3 }).withMessage("first name should be at least 3 characters"),
    body("password").isLength({ min: 6 }).withMessage("password should be at least 6  characters"),

], userController.register)

module.exports = router;