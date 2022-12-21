const { ResponseHelper } = require("./setup");
const userController = require("../controllers/user-controller");
const hikeController = require("../controllers/hike-controller");
const registeredHikeController = require("../controllers/registered-hike-controller");
const { UserType, Difficulty } = require("../models/enums");
const dotenv = require("dotenv");

dotenv.config();

const createLocalGuide = async () => {
	const responseUserCreation = new ResponseHelper();
	await userController.createUser(
		{
			body: {
				email: "localguide@test.com",
				fullName: "John Doe",
				userType: UserType.LOCAL_GUIDE,
				password: process.env.DEFAULT_PASSWORD,
				confirmPassword: process.env.DEFAULT_PASSWORD,
			},
		},
		responseUserCreation
	);
	return responseUserCreation;
};

const createHiker = async () => {
	const responseUserCreation = new ResponseHelper();
	await userController.createUser(
		{
			body: {
				email: "hiker@test.com",
				fullName: "John Doe",
				userType: UserType.HIKER,
				password: process.env.DEFAULT_PASSWORD,
				confirmPassword: process.env.DEFAULT_PASSWORD,
			},
		},
		responseUserCreation
	);
	return responseUserCreation;
};

const createHike = async (responseUserCreation) => {
	const response = new ResponseHelper();

	await hikeController.createHike(
		{
			user: {
				_id: responseUserCreation.responseBody._id,
				userType: UserType.LOCAL_GUIDE,
				email: "hiker@test.com",
				fullName: "John Doe",
			},
			body: {
				title: "Test hike",
				length: 12000, // 12 km
				ascent: 200, // 200 m
				expectedTime: 60 * 3, // 3 h
				difficulty: Difficulty.HIKER,
				description: "A test hike",
				startPoint: null,
				endPoint: null,
				referencePoints: [],
				trackPoints: [
					[45.177786, 7.083372],
					[45.177913, 7.083268],
					[45.178044, 7.083159],
				],
			},
		},
		response
	);
	return response;
};

const startHike = async (responseUserCreation, responseHikeCreation) => {
	const startHikeResponse = new ResponseHelper();
	await registeredHikeController.startHike(
		{
			params: { id: responseHikeCreation.responseBody._id },
			user: {
				_id: responseUserCreation.responseBody._id,
				userType: UserType.HIKER,
				email: responseUserCreation.responseBody.email,
				fullName: responseUserCreation.responseBody.fullName,
			},
		},
		startHikeResponse
	);
	return startHikeResponse;
};

const endHike = async (responseUserCreation, responseStartHikeCreation) => {
	// End hike
	const endHikeResponse = new ResponseHelper();
	await registeredHikeController.endHike(
		{
			params: { id: responseStartHikeCreation.responseBody._id },
			user: {
				_id: responseUserCreation.responseBody._id,
				userType: UserType.HIKER,
				email: responseUserCreation.responseBody.email,
				fullName: responseUserCreation.responseBody.fullName,
			},
		},
		endHikeResponse
	);
	return endHikeResponse;
};

module.exports = {
	createLocalGuide,
	createHiker,
	createHike,
	startHike,
	endHike,
};
