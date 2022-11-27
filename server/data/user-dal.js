const User = require("../models/user-model");

/**
 * @typedef {Object} User
 * @property {String} _id
 * @property {String} email
 * @property {String} fullName
 * @property {String} userType
 * @property {String} salt
 * @property {String} hash
 * @property {String} uniqueString
 * @property {Boolean} isValid
 */

/**
 * Get all users.
 * @param {*} filterQuery Filter object for MongoDB query
 * @returns {Promise<[User]>}
 */
async function getUsers(filterQuery = {}) {
	const users = await User.find(filterQuery).lean();
	return users;
}

/**
 * Create a new user.
 * @param {User} user User to create. Object must match User model.
 * @returns {Promise<User>}
 */
async function createUser(user) {
	const newUser = new User(user);
	const savedUser = await newUser.save();
	return savedUser;
}

/**
 * Updates a user
 * @param {User} user 
 */
async function updateUser(user) {
	await User.findByIdAndUpdate(user._id, { $set: user }, { new: true });
}

module.exports = {
	getUsers,
	createUser,
	updateUser,
};
