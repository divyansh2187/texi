const UserModel = require("../models/UserModel");

module.exports.createUser = async({ firstName, lastName, email, password }) => {
    if (!firstName || !email || !password) {
        throw new error("all fields are required");
    }

    const user = userModel.createUser({
        fullname: {
            firstName,
            lastName
        },
        email,
        password
    })
    return user;
}