const userModel = require('../models/UserModel');
const blacklist = require('../models/blacklistToken.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const captainModel = require('../models/CaptianModel') 


module.exports.authUser = async (req, res, next) => {
    const token = (req.cookies.token || req.headers.authorization?.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ massage: " Unauthorized1" });
    }

    const isBlacklisted = await  blacklist.findOne({ token: token });
    if (isBlacklisted) {
        res.status(401).json({ massage: 'Unauthorized2' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id)

        req.user = user;
        return next();

    } catch (err) {
        return res.status(401).json({
            massage: "Unauthorized3"
        })

    }
}


module.exports.authCaptain = async (req, res, next) => {
    const token = (req.cookies.token || req.headers.authorization?.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ massage: " Unauthorized1" });
    }

    const isBlacklisted = await  blacklist.findOne({ token: token });
    if (isBlacklisted) {
        res.status(401).json({ massage: 'Unauthorized2' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)

        req.captain = captain;
        return next();

    } catch (err) {
        return res.status(401).json({
            massage: "Unauthorized3"
        })

    }
}