"use strict";
const userController = require("../../controllers/user-controller");
const { StatusCodes } = require("http-status-codes");
const { UserType } = require("../../models/enums");
const { setupDB, ResponseHelper } = require("../setup");
const ObjectId = require("mongoose").Types.ObjectId;
const dotenv = require("dotenv");

dotenv.config();

jest.mock("nodemailer");

const nodemailer = require("nodemailer");

setupDB("user-controller");

beforeEach(() => {
	nodemailer.clearAllInboxes();
});

describe("getUsers", () => {
	test("all users", async () => {
		const response = new ResponseHelper();
		await userController.getUsers(
			{
				query: {},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
		expect(Array.isArray(response.responseBody)).toBe(true);
	});

	test("all users with pagination", async () => {
		const response = new ResponseHelper();
		await userController.getUsers(
			{
				query: {
					page: 1,
					pageSize: 10,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
		expect(response.responseBody && typeof response.responseBody === "object").toBe(true);
		expect(Array.isArray(response.responseBody.data)).toBe(true);
		expect(Array.isArray(response.responseBody.metadata)).toBe(true);
	});
});

describe("createUser", () => {

	test("insert user", async () => {
		const response = new ResponseHelper();
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
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
	});

	
	test("insert user", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "localguide@test.com",
					fullName: "John Doe",
					userType: UserType.LOCAL_GUIDE,
					password: process.env.DEFAULT_PASSWORD,
					confirmPassword: process.env.DEFAULT_PASSWORD,
					phone: "333651289",
					website: "www.hikeexperience.com"
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "hiker.test.com", // Wrong email format
					fullName: "John Doe",
					userType: "Wrong type",
					password: process.env.DEFAULT_PASSWORD,
					confirmPassword: "wrong password",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});

	test("duplicate insert user", async () => {
		const response = new ResponseHelper();
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
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
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
			response
		);
		expect(response.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
	});
});

describe("verifyUser", () => {
	test("verify user", async () => {
		const response = new ResponseHelper();
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
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		const receivedEmails = nodemailer.getInboxFor("hiker@test.com");
		expect(receivedEmails.length).toBe(1);
		const verifyUrl = receivedEmails[0].html.match(/http:\/\/localhost:3000\/verify\/[^\"\/]+/)[0];
		const uniqueString = verifyUrl.substr(verifyUrl.lastIndexOf("/") + 1);
		await userController.verifyUser(
			{
				params: {
					uniqueString: uniqueString,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("error in unique string", async () => {
		const response = new ResponseHelper();
		await userController.verifyUser(
			{
				params: {
					uniqueString: "123456",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
});

describe("update User", () => {
	test("update user type", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "update1@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: process.env.DEFAULT_PASSWORD,
					confirmPassword: process.env.DEFAULT_PASSWORD,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser(
			{
				user: {
					userType: UserType.PLATFORM_MANAGER,
					fullName: "PM",
				},
				params: {
					id: response.responseBody._id,
				},
				body: {
					userType: UserType.HUT_WORKER,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("update user password", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "update2@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: process.env.DEFAULT_PASSWORD,
					confirmPassword: process.env.DEFAULT_PASSWORD,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser(
			{
				user: {
					userType: UserType.PLATFORM_MANAGER,
					fullName: "PM",
				},
				params: {
					id: response.responseBody._id,
				},
				body: {
					password: process.env.DEFAULT_PASSWORD + "update",
					confirmPassword: process.env.DEFAULT_PASSWORD + "update",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("update user validity", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "update3@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: process.env.DEFAULT_PASSWORD,
					confirmPassword: process.env.DEFAULT_PASSWORD,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser(
			{
				user: {
					userType: UserType.PLATFORM_MANAGER,
					fullName: "PM",
				},
				params: {
					id: response.responseBody._id,
				},
				body: {
					isValid: true,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "update3@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: process.env.DEFAULT_PASSWORD,
					confirmPassword: process.env.DEFAULT_PASSWORD,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser(
			{
				user: {
					userType: UserType.PLATFORM_MANAGER,
					fullName: "PM",
				},
				params: {
					id: response.responseBody._id,
				},
				body: {
					erroneousField: "sdufndfnj",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});

describe("updatePreferences", () => {
	test("update preferences", async () => {
		const response = new ResponseHelper();
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
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updatePreferences(
			{
				user: {
					_id: response.responseBody._id,
				},
				body: {
					minLength: 500,
					maxLength: 1000,
					minAscent: 0,
					maxAscent: 200,
					minExpectedTime: 0,
					maxExpectedTime: 1200,
					difficulty: "Hiker",
					locationCoordinatesLat: 45.06837,
					locationCoordinatesLng: 7.68307,
					locationRadius: 50000,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("user not found", async () => {
		const response = new ResponseHelper();
		await userController.updatePreferences(
			{
				user: {
					_id: new ObjectId("123456789123"),
				},
				body: {
					minLength: 500,
					maxLength: 1000,
					minAscent: 0,
					maxAscent: 200,
					minExpectedTime: 0,
					maxExpectedTime: 1200,
					difficulty: "Hiker",
					locationCoordinatesLat: 45.06837,
					locationCoordinatesLng: 7.68307,
					locationRadius: 50000,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
});

describe("getPreferences", () => {
	test("get preferences", async () => {
		const responseUser = new ResponseHelper();
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
			responseUser
		);
		expect(responseUser.statusCode).toBe(StatusCodes.CREATED);
		const response = new ResponseHelper();
		await userController.updatePreferences(
			{
				user: {
					_id: responseUser.responseBody._id,
				},
				body: {
					minLength: 500,
					maxLength: 1000,
					minAscent: 0,
					maxAscent: 200,
					minExpectedTime: 0,
					maxExpectedTime: 1200,
					difficulty: "Hiker",
					locationCoordinatesLat: 45.06837,
					locationCoordinatesLng: 7.68307,
					locationRadius: 50000,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
		await userController.getPreferences(
			{
				user: {
					_id: responseUser.responseBody._id,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});
	test("no preferences", async () => {
		const responseUser = new ResponseHelper();
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
			responseUser
		);
		expect(responseUser.statusCode).toBe(StatusCodes.CREATED);
		const response = new ResponseHelper();
		await userController.getPreferences(
			{
				user: {
					_id: responseUser.responseBody._id,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});
	test("user not found", async () => {
		const response = new ResponseHelper();
		await userController.getPreferences(
			{
				user: {
					_id: new ObjectId("123456789123"),
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
});

describe("deletePreferences", () => {
	test("delete preferences", async () => {
		const responseUser = new ResponseHelper();
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
			responseUser
		);
		expect(responseUser.statusCode).toBe(StatusCodes.CREATED);
		const response = new ResponseHelper();
		await userController.updatePreferences(
			{
				user: {
					_id: responseUser.responseBody._id,
				},
				body: {
					minLength: 500,
					maxLength: 1000,
					minAscent: 0,
					maxAscent: 200,
					minExpectedTime: 0,
					maxExpectedTime: 1200,
					difficulty: "Hiker",
					locationCoordinatesLat: 45.06837,
					locationCoordinatesLng: 7.68307,
					locationRadius: 50000,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
		await userController.deletePreferences(
			{
				user: {
					_id: responseUser.responseBody._id,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});
	test("user not found", async () => {
		const response = new ResponseHelper();
		await userController.deletePreferences(
			{
				user: {
					_id: new ObjectId("123456789123"),
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
});
