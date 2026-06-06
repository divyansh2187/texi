const Joi = require("joi");

const addressSchema = Joi.object({
    address: Joi.string()
        .min(3)
        .max(100)
        .required()
});

module.exports = {
    addressSchema
};