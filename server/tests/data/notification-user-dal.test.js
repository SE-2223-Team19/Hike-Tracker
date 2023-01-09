const notificationUserDAL = require("../../data/notification-user-dal");
const { setupDB, ResponseHelper } = require("../setup");
const { createLocalGuide, createHiker, createHike, createShortHike, startHike, endHike } = require("../sample-data");
const dotenv = require("dotenv");
const taskScheduler = require("../../task-scheduler");
const registeredHikeDAL = require("../../data/registered-hike-dal");

dotenv.config();

jest.mock("nodemailer");

const nodemailer = require("nodemailer");
const { StatusCodes } = require("http-status-codes");

setupDB("notification-user-dal");

beforeEach(() => {
	nodemailer.clearAllInboxes();
});

afterAll(() => {
	taskScheduler.clearAll();
});

describe("NotificationUser", () => {
    test("insert and get notification", async () => {
        // Create local guide
        const localguideReponse = await createLocalGuide();

        // Create hike
        const hikeResponse = await createHike(localguideReponse);

        // Create hiker
        const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);

        expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);
        const allNotificationUser = await notificationUserDAL.getNotificationUser();
        expect(allNotificationUser.length).toBe(1);
        const myNotificationUser = await notificationUserDAL.getNotificationUserByUserID(hikerResponse.responseBody._id);
        expect(myNotificationUser.length).toBe(1);
    });
    
    test("insert and get notification multiple times", async () => {
        // Create local guide
        const localguideReponse = await createLocalGuide();

        // Create hike
        const hikeResponse = await createHike(localguideReponse);

        // Create hiker
        const hikerResponse = await createHiker();

        const times = 40;
        for (let i = 0;i < times; i++) {
            // Start hike
            const startHikeResponse = await startHike(hikerResponse, hikeResponse);

            expect(startHikeResponse.statusCode).toBe(StatusCodes.CREATED);
            const allNotificationUser = await notificationUserDAL.getNotificationUser();
            expect(allNotificationUser.length).toBe(1);
            const myNotificationUser = await notificationUserDAL.getNotificationUserByUserID(hikerResponse.responseBody._id);
            expect(myNotificationUser.length).toBe(1);

            expect(myNotificationUser[0].completedHikes.length).toBe(i);

            const endHikeResponse = await endHike(hikerResponse, startHikeResponse);
            expect(endHikeResponse.statusCode).toBe(StatusCodes.OK);
        }
        const allNotificationUser = await notificationUserDAL.getNotificationUser();
        expect(allNotificationUser.length).toBe(1);
        const myNotificationUser = await notificationUserDAL.getNotificationUserByUserID(hikerResponse.responseBody._id);
        expect(myNotificationUser.length).toBe(1);

        expect(myNotificationUser[0].completedHikes.length).toBe(times);
    }, 10000);

    test("Test cancel registered Hike Fail", async () => {
        // Create local guide
        const localguideReponse = await createLocalGuide();

        // Create hike
        const hikeResponse = await createHike(localguideReponse);

        // Create hiker
        const hikerResponse = await createHiker();

        const response = await registeredHikeDAL.cancelRegisteredHike(hikeResponse.responseBody._id);
        expect(response).toBe(null);
    });

    test("Test cancel registered Hike", async () => {
        // Create local guide
        const localguideReponse = await createLocalGuide();

        // Create hike
        const hikeResponse = await createHike(localguideReponse);

        // Create hiker
        const hikerResponse = await createHiker();

		// Start hike
		const startHikeResponse = await startHike(hikerResponse, hikeResponse);

        const response = await registeredHikeDAL.cancelRegisteredHike(startHikeResponse.responseBody._id.toString());
        expect(response.status).toBe('cancelled')
        
    });

});