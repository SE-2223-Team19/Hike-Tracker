const User = require("../models/user-model");

/**
 * Get all users.
 * @param {*} filterQuery Filter object for MongoDB query
 * @returns Users
 */
async function getUsers(filterQuery = {}) {
	const users = await User.find(filterQuery).lean();
	return users;
}

/**
 * Create a new user.
 * @param {*} hike User to create. Object must match User model.
 * @returns User
 */
async function createUser(user) {
	const newUser = new User(user);
	const savedUser = await newUser.save();
	return savedUser;
}
async function updateUser(user) {
	const updatedUser = await User.findByIdAndUpdate(user._id, user, {
		new: true,
	});
	return updatedUser;
}

module.exports = {
	getUsers,
	createUser,
	updateUser,
};
