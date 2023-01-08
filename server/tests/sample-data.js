const { ResponseHelper } = require("./setup");
const userController = require("../controllers/user-controller");
const hikeController = require("../controllers/hike-controller");
const weatherAlertcontroller= require ("../controllers/weather-alert-controller")
const registeredHikeController = require("../controllers/registered-hike-controller");
const { UserType, Difficulty,WeatherCondition } = require("../models/enums");
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
				referencePoints: [[45.177913, 7.083268]],
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

const createShortHike = async (responseUserCreation) => {
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
				expectedTime: 0.01, // 0.6 s
				difficulty: Difficulty.HIKER,
				description: "A short test hike",
				startPoint: null,
				endPoint: null,
				referencePoints: [[45.177913, 7.083268]],
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
			},
		},
		endHikeResponse
	);
	return endHikeResponse;
};

const updateWeatherAlert = async(responseUserCreation)=>{
	const response = new ResponseHelper()
	await weatherAlertcontroller.updateWeatherAlert(
		{
			user: {
				_id: responseUserCreation.responseBody.id,
				userType: UserType.PLATFORM_MANAGER,
				email: "test_PlatformManager@test.it",
				fullName: "test_PlatformManager@test.it",
			},
			body: {
				weatherAlert: WeatherCondition.BLIZZARD,
				radius:50,
				coordinates: [45.177786, 7.083372],
			},
		},
		response
	);
	return response;
}

module.exports = {
	createLocalGuide,
	createHiker,
	createHike,
	createShortHike,
	startHike,
	endHike,
	updateWeatherAlert
};
