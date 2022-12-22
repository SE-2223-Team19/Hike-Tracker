const { UserType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");
const dotenv = require("dotenv");
const registeredHikeController = require("../controllers/registered-hike-controller");
const { createLocalGuide, createHiker, createHike, startHike, endHike } = require("./sample-data");
const { StatusCodes } = require("http-status-codes");

dotenv.config();
setupDB("registered-hike-test");

describe("Registered Hike", () => {

	jest.setTimeout(10000);

	test("Start a new hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = new ResponseHelper();
		await registeredHikeController.startHike(
			{
				params: { id: hikeResponse.responseBody._id },
				user: {
					_id: hikerResponse.responseBody._id,
					userType: UserType.HIKER,
					email: hikeResponse.responseBody.email,
					fullName: hikeResponse.responseBody.fullName,
				},
			},
			startHikeResponse
		);

		// Check if the response is correct
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);
	});

	test("Hiker should start only one hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);
		const hikeResponse2 = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = new ResponseHelper();
		await registeredHikeController.startHike(
			{
				params: { id: hikeResponse.responseBody._id },
				user: {
					_id: hikerResponse.responseBody._id,
					userType: UserType.HIKER,
					email: hikeResponse.responseBody.email,
					fullName: hikeResponse.responseBody.fullName,
				},
			},
			startHikeResponse
		);

		// Check if the response is correct
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		// Start hike
		const startHikeResponse2 = new ResponseHelper();
		await registeredHikeController.startHike(
			{
				params: { id: hikeResponse2.responseBody._id },
				user: {
					_id: hikerResponse.responseBody._id,
					userType: UserType.HIKER,
					email: hikerResponse.responseBody.email,
					fullName: hikerResponse.responseBody.fullName,
				},
			},
			startHikeResponse2
		);

		// Check if the response is correct
		expect(startHikeResponse2.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});

	test("Hiker cannot start an hike that doen't exist", async () => {
		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = new ResponseHelper();
		await registeredHikeController.startHike(
			{
				params: { id: "5f9f1b9b9b9b9b9b9b9b9b9b" },
				user: {
					_id: hikerResponse.responseBody._id,
					userType: UserType.HIKER,
					email: hikerResponse.responseBody.email,
					fullName: hikerResponse.responseBody.fullName,
				},
			},
			startHikeResponse
		);

		// Check if the response is correct
		expect(startHikeResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});

	test("Hiker can end hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		// End hike
		const endHikeResponse = new ResponseHelper();
		await registeredHikeController.endHike(
			{
				params: { id: startHikeResponse.responseBody._id.toString() },
				user: {
					_id: hikerResponse.responseBody._id,
				},
			},
			endHikeResponse
		);

		// Check if the response is correct
		expect(endHikeResponse.statusCode).toBe(StatusCodes.OK);
	});

	test("Hiker can't end hike he has't started", async () => {
		// Create hiker
		const hikerResponse = await createHiker();

		// End hike
		const endHikeResponse = new ResponseHelper();
		await registeredHikeController.endHike(
			{
				params: { id: "5f9f1b9b9b9b9b9b9b9b9b9b" },
				user: {
					_id: hikerResponse.responseBody._id,
				},
			},
			endHikeResponse
		);

		// Check if the response is correct
		expect(endHikeResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
});
