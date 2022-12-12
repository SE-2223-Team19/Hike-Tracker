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
 * @property {Boolean} isEmailValidated
 * @property {Boolean} isValid
 */

/**
 * Get all users.
 * @param {*} filterQuery Filter object for MongoDB query
 * @returns {Promise<[User]>}
 */
async function getUsers(filterQuery = {}, page, pageSize) {
	const paginationActive = page !== undefined && pageSize !== undefined;

	let p = [
		{
			$match: filterQuery,
		},
	];

	if (paginationActive) {
		p = [
			...p,
			{
				$facet: {
					data: [
						{
							$skip: (page - 1) * pageSize,
						},
						{
							$limit: pageSize,
						},
					],
					metadata: [
						{
							$count: "totalElements",
						},
						{
							$addFields: {
								type: "pagination",
								currentPage: page,
								pageSize: pageSize,
								totalPages: {
									$ceil: {
										$divide: ["$totalElements", pageSize],
									},
								},
							},
						},
					],
				},
			},
		];
	}

	const users = await User.aggregate(p);

	if (paginationActive) return users[0];

	return users;
}

async function getUserById(id) {
	const user = await User.findById(id);
	return user;
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
 * @param {String} id
 * @param {User} user
 */
async function updateUser(id, user) {
	return await User.findByIdAndUpdate(id, user, { new: true }).lean();
}

async function getUserById(id) {
	return await User.findById(id).lean();
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	getUserById,
};
