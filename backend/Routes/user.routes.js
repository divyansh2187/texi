const exprees = require("express");
const router = exprees.Router();
const { body } = require("express-validator");
const userController = require("../Controllers/user.controller");
const authMiddleware = require('../middlewares/auth.middleware')

router.post("/register", [
    body("email").isEmail().withMessage("please enter a valid email"),
    body("fullname.firstName").isLength({ min: 3 }).withMessage("first name should be at least 3 characters"),
    body("password").isLength({ min: 6 }).withMessage("password should be at least 6  characters"),

], userController.registerUser);



router.post("/login", [body("Email").isEmail().withMessage("please enter a valid email"),
    body("password").isLength({ min: 3 }).withMessage("password should be at least 6 characters")

], userController.loginUser);


router.get("/profile", authMiddleware.authUser, userController.GetUserProfile)


router.get("/logout", authMiddleware.authUser, userController.logoutUser)



module.exports = router;