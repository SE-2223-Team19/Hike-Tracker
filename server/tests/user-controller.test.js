"use strict";
const userController = require("../controllers/user-controller");
const { StatusCodes } = require("http-status-codes");
const { UserType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");

setupDB("user-controller");

describe("getUsers", () => {
	test("all users", async () => {
		const response = new ResponseHelper();
		await userController.getUsers({
			query: {

			}
		}, response);
		expect(response.statusCode).toBe(StatusCodes.OK);
		expect(Array.isArray(response.responseBody)).toBe(true);
	});

	test("all users with pagination", async () => {
		const response = new ResponseHelper();
		await userController.getUsers({
			query: {
				page: 1,
				pageSize: 10
			}
		}, response);
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

describe("update User", () => {
	test("update user type", async () => {
		const response = new ResponseHelper();
		await userController.createUser(
			{
				body: {
					email: "update1@test.com",
					fullName: "John Doe",
					userType: UserType.HIKER,
					password: "password",
					confirmPassword: "password",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser({
			user: {
				userType: UserType.PLATFORM_MANAGER,
				fullName: "PM"
			},
			params: {
				id: response.responseBody._id
			},
			body: {
				userType: UserType.HUT_WORKER
			}
		}, response);
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
					password: "password",
					confirmPassword: "password",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser({
			user: {
				userType: UserType.PLATFORM_MANAGER,
				fullName: "PM"
			},
			params: {
				id: response.responseBody._id
			},
			body: {
				password: "passwordupdate",
				confirmPassword: "passwordupdate"
			}
		}, response);
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
					password: "password",
					confirmPassword: "password",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser({
			user: {
				userType: UserType.PLATFORM_MANAGER,
				fullName: "PM"
			},
			params: {
				id: response.responseBody._id
			},
			body: {
				isValid: true
			}
		}, response);
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
					password: "password",
					confirmPassword: "password",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await userController.updateUser({
			user: {
				userType: UserType.PLATFORM_MANAGER,
				fullName: "PM"
			},
			params: {
				id: response.responseBody._id
			},
			body: {
				erroneousField: "sdufndfnj"
			}
		}, response);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});