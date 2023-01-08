const { setupDB, ResponseHelper } = require("../setup");
const dotenv = require("dotenv");
const registerHikeController = require("../../controllers/registered-hike-controller");
const registeredHikeDAL = require("../../data/registered-hike-dal");
const { createLocalGuide, createHiker, createHike, createShortHike, startHike, endHike } = require("../sample-data");
const { StatusCodes } = require("http-status-codes");

dotenv.config();
setupDB("registered-hike-test");

jest.mock("nodemailer");

const nodemailer = require("nodemailer");
const { UserType } = require("../../models/enums");
const taskScheduler = require("../../task-scheduler");

beforeEach(() => {
	nodemailer.clearAllInboxes();
});

afterAll(() => {
	taskScheduler.clearAll();
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

	test('Get Registered Hike By ID', async() => {
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
		
		const response = new ResponseHelper()
		await registerHikeController.getRegisteredHikeById({
			params: {
				id: startHikeResponse.responseBody._id
			}
		}, response);

		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test('Fail Test Get Registered Hike By ID', async() => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		const response = new ResponseHelper()
		await registerHikeController.getRegisteredHikeById({
			params: {
				id: hikeResponse.responseBody._id
			}
		}, response);

		expect(response.responseBody).toBe(null);
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
		await registeredHikeDAL.addBuddyToRegisteredHike(startHikeResponse.responseBody._id, localguideReponse.responseBody._id);

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
		const hikeID = startHikeResponse.responseBody._id.toString();
		const responsePointRecord = new ResponseHelper();

		await registerHikeController.addRecordPoint({
			params: {
				id: hikeID
			},
			body: {
				point: referencePoint
			}
		}, responsePointRecord);

		expect(responsePointRecord.statusCode).toBe(StatusCodes.OK);
		
	});

	test('Test Plan Hike', async() => {
		
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		const responsePlanHike = new ResponseHelper();
		const planHikeResponse = await registerHikeController.planHike({
			params:{ id: hikeResponse.responseBody._id},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		},responsePlanHike);
		
		expect(responsePlanHike.statusCode).toBe(StatusCodes.CREATED);
		
	});

	test('Test Plan Hike Fails', async() => {
		
		// Create hiker
		const hikerResponse = await createHiker();

		const responsePlanHike = new ResponseHelper();
		const planHikeResponse = await registerHikeController.planHike({
			params:{ id: 0},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		},responsePlanHike);
		
		expect(responsePlanHike.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		
	});

	test('Test Start Planned Hike', async() => {
		
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		const responsePlanHike = new ResponseHelper();
		const planHike = await registerHikeController.planHike({
			params:{ id: hikeResponse.responseBody._id},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		},responsePlanHike);
		
		expect(responsePlanHike.statusCode).toBe(StatusCodes.CREATED);

		const responsePlannedHike = new ResponseHelper(); 
		await registerHikeController.startPlannedHike({
			params:{ id: planHike.responseBody._id},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		}, responsePlannedHike);

		expect(responsePlannedHike.statusCode).toBe(StatusCodes.OK);
		
	});

	test('Test Start Planned Hike Fails Not Found', async() => {
		
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		const responsePlanHike = new ResponseHelper();
		const planHike = await registerHikeController.planHike({
			params:{ id: hikeResponse.responseBody._id},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		},responsePlanHike);
		
		expect(responsePlanHike.statusCode).toBe(StatusCodes.CREATED);

		const responsePlannedHike = new ResponseHelper(); 
		await registerHikeController.startPlannedHike({
			params:{ id: 0},
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		}, responsePlannedHike);

		expect(responsePlannedHike.statusCode).toBe(StatusCodes.NOT_FOUND);
		
	});

	test('Test Start Planned Hike Fails Error General', async() => {
		
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

		const responsePlannedHike = new ResponseHelper(); 
		await registerHikeController.startPlannedHike({
			params:{ id: startHikeResponse.responseBody._id },
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER,
			}
		}, responsePlannedHike);

		expect(StatusCodes.INTERNAL_SERVER_ERROR).toBe(responsePlannedHike.statusCode);
		
	});

	test("Hiker receives notification of unfinished hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createShortHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		await new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					const hikerEmails = nodemailer.getInboxFor("hiker@test.com");
					expect(hikerEmails.length).toBe(2);
			
					const lastEmail = hikerEmails[1];
					expect(lastEmail.subject).toBe(`[${hikeResponse.responseBody.title}] Unfinished Hike`);
					resolve();
				} catch {
					reject(new Error("Unfinished hike email not received"));
				}
			}, 2000);
		});
	});

	test("Hiker can update the start and end time of a registered hike", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		const hikeResponse = await createHike(localguideReponse);

		// Create hiker
		const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);
		expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);

		const updateRegisteredHikeResponse = await registerHikeController.updateRegisteredHike({
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER
			},
			params: {
				id: startHikeResponse.responseBody._id,
			},
			body: {
				startTime: "2023-01-12T17:40"
			}
		}, new ResponseHelper());
		expect(updateRegisteredHikeResponse.statusCode).toBe(StatusCodes.OK);

		const updateRegisteredHikeResponse2 = await registerHikeController.updateRegisteredHike({
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER
			},
			params: {
				id: startHikeResponse.responseBody._id,
			},
			body: {
				startTime: "2023-01-12T17:40",
				endTime: "2023-01-12T17:41"
			}
		}, new ResponseHelper());
		expect(updateRegisteredHikeResponse2.statusCode).toBe(StatusCodes.OK);

		const updateRegisteredHikeResponse3 = await registerHikeController.updateRegisteredHike({
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER
			},
			params: {
				id: startHikeResponse.responseBody._id,
			},
			body: {
				startTime: "2023-01-12T17:40",
				endTime: "2023-01-12T17:39"
			}
		}, new ResponseHelper());
		expect(updateRegisteredHikeResponse3.statusCode).toBe(StatusCodes.BAD_REQUEST);

		const updateRegisteredHikeResponse4 = await registerHikeController.updateRegisteredHike({
			user: {
				_id: hikerResponse.responseBody._id,
				userType: UserType.HIKER
			},
			params: {
				id: "fakeId",
			},
			body: {
				startTime: "2023-01-12T17:40",
				endTime: "2023-01-12T17:41"
			}
		}, new ResponseHelper());
		expect(updateRegisteredHikeResponse4.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
	});

	test('Test Get Stats', async() => {

		// Create hiker
		const hikerResponse = await createHiker();
		const response = new ResponseHelper();

		const stats = await registerHikeController.getStats({
			params: {id: hikerResponse.responseBody._id}
		}, response)
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

});


