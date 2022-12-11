"use strict";
const userController = require("../controllers/user-controller");
const { StatusCodes } = require("http-status-codes");
const { UserType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");
const ObjectId = require("mongoose").Types.ObjectId;

setupDB("user-controller");

describe("createUser", () => {
	test("insert user", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "hiker@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: "password",
					confirmPassword: "password",
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
					password: "password",
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
					password: "password",
					confirmPassword: "password",
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
					password: "password",
					confirmPassword: "password",
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
					password: "password",
					confirmPassword: "password",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.verifyUser(
			{
				params: {
					uniqueString: response.responseBody.uniqueString,
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

describe("updatePreferences", () => {
	test("update preferences", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "hiker@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: "password",
					confirmPassword: "password",
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
					minLength: 500, maxLength: 1000, minAscent: 0, maxAscent: 200, minExpectedTime: 0, maxExpectedTime: 1200, difficulty: "Hiker", locationCoordinatesLat: 45.06837, locationCoordinatesLng: 7.68307, locationRadius: 50000
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
					minLength: 500, maxLength: 1000, minAscent: 0, maxAscent: 200, minExpectedTime: 0, maxExpectedTime: 1200, difficulty: "Hiker", locationCoordinatesLat: 45.06837, locationCoordinatesLng: 7.68307, locationRadius: 50000
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
					password: "password",
					confirmPassword: "password",
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
					minLength: 500, maxLength: 1000, minAscent: 0, maxAscent: 200, minExpectedTime: 0, maxExpectedTime: 1200, difficulty: "Hiker", locationCoordinatesLat: 45.06837, locationCoordinatesLng: 7.68307, locationRadius: 50000
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
					password: "password",
					confirmPassword: "password",
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
					password: "password",
					confirmPassword: "password",
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
					minLength: 500, maxLength: 1000, minAscent: 0, maxAscent: 200, minExpectedTime: 0, maxExpectedTime: 1200, difficulty: "Hiker", locationCoordinatesLat: 45.06837, locationCoordinatesLng: 7.68307, locationRadius: 50000
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
