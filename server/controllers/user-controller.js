const joi = require("joi");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const userDAL = require("../data/user-dal");
const { UserType } = require("../models/enums");

async function createUser(req, res) {
	try {
		// Validate request body
		const { body } = req;

		// Validation schema
		const schema = joi.object().keys({
			email: joi.string().email({ tlds: { allow: false }}).required(),
            fullName: joi.string().required(),
            userType: joi.string().required().valid(...Object.values(UserType)),
            password: joi.string().required(),
            confirmPassword: joi.string().required().allow(joi.ref("password"))
		});

		// Validate request body against schema
		const { error, value } = schema.validate(body);

		if (error) throw error; // Joi validation error, goes to catch block

		// Create new user

        const salt = crypto.randomBytes(16).toString("hex");

        const hash = crypto.scryptSync(value.password, salt, 32).toString("hex");

        const createdUser = await userDAL.createUser({
            email: value.email,
            fullName: value.fullName,
            userType: value.userType,
            hash: hash,
            salt: salt
        });
		return res.status(StatusCodes.CREATED).json(createdUser);
	} catch (err) {
		if (err.name === "MongoServerError" && err.code === 11000) {
			return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ err: "This email is already used for another account" });
		}
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.details.map(e => e.message).join(", ") });
	}
}

module.exports = {
	createUser
};