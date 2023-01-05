const { setupDB, ResponseHelper } = require("./setup");
const dotenv = require("dotenv");
const registerHikeController = require("../controllers/registered-hike-controller");
const registeredHikeDAL = require("../data/registered-hike-dal");
const { createLocalGuide, createHiker, createHike, startHike, endHike } = require("./sample-data");
const { StatusCodes } = require("http-status-codes");

dotenv.config();
setupDB("registered-hike-test");

jest.mock("nodemailer");

const nodemailer = require("nodemailer");
const { UserType } = require("../models/enums");

beforeEach(() => {
	nodemailer.clearAllInboxes();
});

describe("Registered Hike", () => {

	test("Get registered hike", async () => {
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

		const getRegisteredHikesResponse = await registerHikeController.getRegisteredHikes({
			params: {
				userId: hikerResponse.responseBody._id
			},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER
			}
		}, new ResponseHelper());


		expect(getRegisteredHikesResponse.statusCode).toBe(StatusCodes.OK);
		expect(getRegisteredHikesResponse.responseBody.length).toBe(1);
	});

	test("Get registered hike for unknown userId format", async () => {
		const getRegisteredHikesResponse = await registerHikeController.getRegisteredHikes({
			params: {
				userId: "fakeUserId"
			},
			user: {
				_id: "5f9f1b9b9b9b9b9b9b9b9b9b",
				userType: UserType.HIKER
			}
		}, new ResponseHelper());
		expect(getRegisteredHikesResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});

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
		const startHikeResponse2 = await startHike(hikerResponse, hikeResponse2);

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

		let localguideEmails = nodemailer.getInboxFor("localguide@test.com");
		expect(localguideEmails.length).toBe(1);

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		// Add buddies
		const registeredHike = await registeredHikeDAL.addBuddyToRegisteredHike(startHikeResponse.responseBody._id, localguideReponse.responseBody._id);

		// End hike
		const endHikeResponse = await endHike(hikerResponse, startHikeResponse);

		localguideEmails = nodemailer.getInboxFor("localguide@test.com");
		expect(localguideEmails.length).toBe(2);
		const lastEmail = localguideEmails[1];
		expect(lastEmail.subject).toBe(`[${hikeResponse.responseBody.title}] Registered hike terminated`);

		// Check if the response is correct
		expect(endHikeResponse.statusCode).toBe(StatusCodes.OK);
	});

	test("End registered hike for unknown userId format", async () => {

		const hikerResponse = new ResponseHelper();
		hikerResponse.json({
			_id: "fakeUserId"
		});

		const startHikeResponse = new ResponseHelper();
		startHikeResponse.json({
			_id: "fakeRegisteredHikeId"
		});
		const endHikeResponse = await endHike(hikerResponse, startHikeResponse);
		expect(endHikeResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});
	test("Get stats", async () => {
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

		const getStats = await registerHikeController.getStats({
			params: {
				id: hikerResponse.responseBody._id
			},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER
			}
		}, new ResponseHelper());
		expect(getStats.statusCode).toBe(StatusCodes.OK);
	});
	test("Can't get stats because user doesn't exist", async () => {
		const getStatsResponse = await registerHikeController.getStats({
			params: {
				id: "fakeUserId"
			},
			user: {
				_id: "5f9f1b9b9b9b9b9b9b9b9b9b",
				userType: UserType.HIKER
			}
		}, new ResponseHelper());
		expect(getStatsResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});

	test("Add record point from users", async () => {

		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);

		// Check if the response is correct
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		const referencePoint = hikeResponse.responseBody.referencePoints[0]
		const hikeID = startHikeResponse.responseBody._id.toString()
		const responsePointRecord = new ResponseHelper()

		await registerHikeController.addRecordPoint({
			params: {
				id: hikeID
			},
			body: {
				point: referencePoint
			}

		}, responsePointRecord)

		expect(responsePointRecord.statusCode).toBe(StatusCodes.OK);

	})


});


