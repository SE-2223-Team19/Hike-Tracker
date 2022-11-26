const joi = require("joi");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const userDAL = require("../data/user-dal");
const { UserType } = require("../models/enums");
const { randString } = require("../mail_verification/utility");
const { sendEmail } = require("../mail_verification/verification");

/**
 * POST /user
 * Creates a new user and sends the verification email
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function createUser(req, res) {
	try {
		// Validate request body
		const { body } = req;

		// Validation schema
		const schema = joi.object().keys({
			email: joi.string().email({ tlds: { allow: false } }).required(),
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

		const uniqueString = randString();

		const isValid = false;

		const createdUser = await userDAL.createUser({
			email: value.email,
			fullName: value.fullName,
			userType: value.userType,
			hash: hash,
			salt: salt,
			uniqueString: uniqueString,
			isValid: isValid
		});

		await sendEmail(value.email, uniqueString);
		return res.status(StatusCodes.CREATED).json({ _id: createdUser._id });
	} catch (err) {
		if (err.name === "MongoServerError" && err.code === 11000) {
			return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ err: "This email is already used for another account" });
		}
		return res.status(StatusCodes.BAD_REQUEST).json({ err: err.details.map(e => e.message).join(", ") });
	}
}

/**
 * POST /user/:uniqueString
 * Verifies the user by the uniqueString in the url
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<Response>}
 */
async function verifyUser(req, res) {
	const uniqueString = req.params.uniqueString;
	const users = await userDAL.getUsers({ uniqueString: uniqueString });
	const user = users[0];
	if (user) {
		user.isValid = true;
		await userDAL.updateUser(user);
		return res.status(StatusCodes.OK).json({ message: "Your email address has been verified.", verified: true });
	} else {
		return res.status(StatusCodes.NOT_FOUND).json({ message: "Your email address hasn't been verified.", verified: false });
	}
}

module.exports = {
	createUser,
	verifyUser
};