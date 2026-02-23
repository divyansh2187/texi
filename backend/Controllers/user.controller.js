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