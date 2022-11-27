"use strict";
const userController = require("../controllers/user-controller");
const { StatusCodes } = require("http-status-codes");
const { UserType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");

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
