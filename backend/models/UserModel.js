const mongoose = require("mongoose");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    fullname: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "first name should be at least 3 characters"],
        },
        lastName: {
            type: String,
            minlength: [3, "last name should be at least 3 characters"],
        },
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "email should be at least 5 characters"],
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [6, "password should be at least 6 characters"]
    },
    socketId: {
        type: String,
    }
});


userSchema.methods.generateToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    const isMatch = await Bcrypt.compare(password, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function(password) {
    return await Bcrypt.hash(password, 10);
}
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;