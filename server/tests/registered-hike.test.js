const { UserType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");
const dotenv = require("dotenv");
const registeredHikeController = require("../controllers/registered-hike-controller");
const { createLocalGuide, createHiker, createHike, startHike, endHike } = require("./sample-data");
const { StatusCodes } = require("http-status-codes");

dotenv.config();
setupDB("registered-hike-test");

jest.mock("nodemailer");

describe("Registered Hike", () => {

	const nodemailer = require("nodemailer");

	test("Start a new hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);

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
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);

		// Check if the response is correct
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		// Start hike
		const startHikeResponse2 = await startHike(hikerResponse, hikeResponse);

		// Check if the response is correct
		expect(startHikeResponse2.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});

	test("Hiker cannot start an hike that doen't exist", async () => {
		// Create hiker
		const hikerResponse = await createHiker();

		// Simulating create hike response
		const hikeResponse = new ResponseHelper();
		hikeResponse.json({
			_id: "5f9f1b9b9b9b9b9b9b9b9b9b"
		});

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);

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
		const endHikeResponse = await endHike(hikerResponse, startHikeResponse);

		// Check if the response is correct
		expect(endHikeResponse.statusCode).toBe(StatusCodes.OK);
	});

	test("Hiker can't end hike he has't started", async () => {
		// Create hiker
		const hikerResponse = await createHiker();

		// Simulating create hike response
		const startHikeResponse = new ResponseHelper();
		startHikeResponse.json({
			_id: "5f9f1b9b9b9b9b9b9b9b9b9b"
		});

		// End hike
		const endHikeResponse = await endHike(hikerResponse, startHikeResponse)

		// Check if the response is correct
		expect(endHikeResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
	
	test("Buddies notified at end of hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		// Add buddies

		// End hike
		const endHikeResponse = await endHike(hikerResponse, startHikeResponse);

		// Check if the response is correct
		expect(endHikeResponse.statusCode).toBe(StatusCodes.OK);
	});
});
