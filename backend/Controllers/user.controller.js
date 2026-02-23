const userModel = require('../models/UserModel');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


module.exports.registerUser = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        fullname: { firstName, lastName },
        email,
        password
    } = req.body;

    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        fullname: {
            firstName,
            lastName
        },
        email,
        password: hashPassword
    });

    const token = user.generateToken();
    res.status(201).json({ user, token });
}


module.exports.loginUser = async(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() });

    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({ message: "invalid credentials" })
    };

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: "invalid credentials" });
    }

    const token = user.generateToken();

    res.status(200).json({ user, token });

}