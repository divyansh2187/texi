const captainModel = require('../models/CaptianModel');
const blackList = require('../models/blacklistToken.model')
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async(req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainExist = await captainModel.findOne({ email });

    if (isCaptainExist) {
        return res.status(400).json({ message: 'captain already exist' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType

    })

    const token = captain.generateToken();

  

    res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })
    .json({ status: "success", captain, token });

}


module.exports.loginCaptain = async (req, res, next) => {
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array(),
            });
        }

        const { email, password } = req.body;

        const captain = await captainModel
            .findOne({ email })
            .select("+password");

        if (!captain) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = captain.generateToken();

        captain.password = undefined;

        res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
            })
            .json({
                status: "success",
                captain,
                token,
            });
    } catch (err) {
        console.error("Captain login error:", err);
        next(err); // Passes the error to your global error handler
    }
};


module.exports.getCaptainProfile = async(req , res , next)=>{
    res.status(200).json({captain : req.captain});
}

module.exports.logoutCaptain = async(req , res , next)=>{
   const token = req.cookies.token ||  req.headers.authorization?.split(' ')[1];

   await blackList.create({token});
    res.clearCookie('token');

    res.status(200).json({ message:'successfully logout' });

}