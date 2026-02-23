const UserModel = require("../models/UserModel");

module.exports.createUser = async({ fullname, email, password }) => {

    if (!fullname || !fullname.firstName || !email || !password) {
        throw new Error("All fields are required");
    }

    const user = await UserModel.create({
        fullname,
        email,
        password
    });

    return user;
};