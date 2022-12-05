const joi = require("joi");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const userDAL = require("../data/user-dal");
const { UserType } = require("../models/enums");
const { randString } = require("../helper/utility");
const { sendVerificationEmail, sendAccountBlockedEmail, sendAccountValidatedEmail } = require("../email/account");

async function getUsers(req, res) {
	try {
		const { query } = req;

		const schema = joi.object().keys({
			email: joi
				.string()
				.email({ tlds: { allow: false } }),
			fullName: joi.string(),
			userType: joi
				.string()
				.valid(...Object.values(UserType)),
			page: joi.number().greater(0),
			pageSize: joi.number().greater(0),
		});

		const { error, value } = schema.validate(query);

		if (error) throw error;

		const {page, pageSize, ...filter} = value;

		const users = await userDAL.getUsers(filter, page, pageSize);
		if (Array.isArray(users)) {
			return res.status(StatusCodes.OK).json(users.map(u => {
				const { salt, hash, uniqueString, ...user} = u;
				return user;
			}));
		}
		return res.status(StatusCodes.OK).json({
			...users,
			data: users.data.map(u => {
				const { salt, hash, uniqueString, ...user} = u;
				return user;
			})
		});
	} catch (err) {
		return res
		.status(StatusCodes.BAD_REQUEST)
		.json({ err: err.message });
	}
}

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
			email: joi
				.string()
				.email({ tlds: { allow: false } })
				.required(),
			fullName: joi.string().required(),
			userType: joi
				.string()
				.required()
				.valid(...Object.values(UserType)),
			password: joi.string().required(),
			confirmPassword: joi.string().required().allow(joi.ref("password")),
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
			isValid: isValid,
		});

		await sendVerificationEmail(value.email, uniqueString);
		return res
			.status(StatusCodes.CREATED)
			.json({ _id: createdUser._id, uniqueString: uniqueString });
	} catch (err) {
		if (err.name === "MongoServerError" && err.code === 11000) {
			return res
				.status(StatusCodes.UNPROCESSABLE_ENTITY)
				.json({ err: "This email is already used for another account" });
		}
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ err: err.details.map((e) => e.message).join(", ") });
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
	try {

		const uniqueString = req.params.uniqueString;
		const users = await userDAL.getUsers({ uniqueString: uniqueString });
		const user = users[0];
		if (user) {
			user.isEmailValidated = true;
	
			// For all users except hikers the validation is handled by the platform manager
			if (user.userType === UserType.HIKER) {
				user.isValid = true;
			}
	
			await userDAL.updateUser(user._id, user);
			return res
				.status(StatusCodes.OK)
				.json({ message: "Your email address has been verified.", verified: true });
		} else {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Your email address hasn't been verified.", verified: false });
		}
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: err });
	}
}

async function updateUser(req, res) {
	try {

		const { id } = req.params;
		const { body } = req;

		const schema = joi.object().keys({
			userType: joi
				.string()
				.valid(...Object.values(UserType)),
			password: joi.string(),
			confirmPassword: joi.string().allow(joi.ref("password")).when(joi.ref("password"), {
				is: joi.exist(),
				then: joi.required(),
				otherwise: joi.forbidden()
			}),
			isValid: joi.boolean()
		});

		const { error, value } = schema.validate(body);

		if (error) throw error;

		console.log(value);

		let user = {};

		if (value.userType) user.userType = value.userType;
		if (value.password && value.confirmPassword) {
			const salt = crypto.randomBytes(16).toString("hex");
			const hash = crypto.scryptSync(value.password, salt, 32).toString("hex");

			user.hash = hash;
			user.salt = salt;
		}
		if (value.isValid !== undefined) user.isValid = value.isValid;

		const updatedUser = await userDAL.updateUser(id, user);

		if (value.isValid !== undefined) {
			if (value.isValid) {
				sendAccountValidatedEmail(updatedUser.email, req.user.fullName);
			}
			else {
				sendAccountBlockedEmail(updatedUser.email, req.user.fullName);
			}
		}

		return res.status(StatusCodes.OK).end();
	} catch (err) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ err: err.message });
	}
}

module.exports = {
	getUsers,
	createUser,
	verifyUser,
	updateUser
};
