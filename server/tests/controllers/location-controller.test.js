"use strict";
const locationController = require("../../controllers/location-controller");
const userController = require("../../controllers/user-controller");
const { StatusCodes } = require("http-status-codes");
const { LocationType, UserType } = require("../../models/enums");
const { setupDB, ResponseHelper } = require("../setup");
const dotenv = require("dotenv");

dotenv.config();

setupDB("location-controller");

describe("getLocations", () => {
	test("get all", async () => {
		const response = new ResponseHelper();
		await locationController.getLocations(
			{
				query: {},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await locationController.getLocations(
			{
				query: {
					type: "Wrong Type",
					page: 0,
					pageSize: 50,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});

describe("createLocation", () => {
	test("insert location", async () => {
		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				body: {
					locationType: LocationType.DEFAULT,
					description: "A test default location",
					point: [7.68307, 45.06837], // Wants a <longitude>, <latitude> array
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
	});

	test("insert new Hut", async () => {
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

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HUT_WORKER,
					email: "hut_worker@test.com",
					fullName: "John Doe",
				},
				body: {
					name: "A test hut",
					locationType: LocationType.HUT,
					description: "A test hut",
					point: [7.68307, 45.06837],
					phone: "332344435",
					email: "test@polito.it",
					webSite: "",
					altitude: 10,
					numberOfBeds: 15,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
	});

	test("insert parking coordination", async () => {
		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				body: {
					name: "A parking lot",
					locationType: LocationType.PARKING_LOT,
					description: "A test parking lot",
					capacity: 20,
					point: [32.5, 18.1],
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
	});

	test("insert parking coordination", async () => {
		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				body: {
					locationType: LocationType.PARKING_LOT,
					description: "A test parking lot",
					point: ["aaaaaa", 18.1],
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
	test("error in schema", async () => {
		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				body: {
					type: LocationType.HUT,
					description: "A test hut",
					point: [7.68307, 45.06837, 12.123], // Wrong array length
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});

describe("updateLocationDescription", () => {
	test("update location", async () => {
		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				body: {
					locationType: LocationType.DEFAULT,
					description: "A test hut",
					point: [7.68307, 45.06837], // Wants a <longitude>, <latitude> array
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await locationController.updateLocationDescription(
			{
				params: {
					id: response.responseBody._id,
				},
				body: {
					description: "A test hut updated",
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await locationController.createLocation(
			{
				body: {
					locationType: LocationType.DEFAULT,
					description: "A test hut",
					point: [7.68307, 45.06837],
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		await locationController.updateLocationDescription(
			{
				params: {
					id: response.responseBody._id,
				},
				body: {
					description: 123,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});

describe("update Hut Informations", () => {
	test("Try to update fields of hut", async () => {
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

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseCreateLocation = new ResponseHelper();
		const hut_test = await locationController.createLocation(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HUT_WORKER,
					email: "hut_worker@test.com",
					fullName: "John Doe",
				},
				body: {
					name: "A test hut",
					locationType: LocationType.HUT,
					description: "A test hut",
					point: [7.68307, 45.06837],
					phone: "332344435",
					email: "test@polito.it",
					webSite: "",
					altitude: 10,
					numberOfBeds: 15,
				},
			},
			responseCreateLocation
		);
		expect(responseCreateLocation.statusCode).toBe(StatusCodes.CREATED);

		const responseHutUpdate = new ResponseHelper();
		const hut_updated = await locationController.updateLocation(
			{
				params: {
					id: hut_test.responseBody._id,
				},
				body: {
					locationType: LocationType.HUT,
					description: "A test hut for updating",
					email: "test@polito1.it",
					altitude: 15,
					numberOfBeds: 2000,
				},
			},
			responseHutUpdate
		);

		expect(hut_updated.responseBody.description).toBe("A test hut for updating");
		expect(hut_updated.responseBody.numberOfBeds).toBe(2000);
		expect(hut_updated.responseBody.email).toBe("test@polito1.it");
		expect(hut_updated.responseBody.altitude).toBe(15);
		expect(responseHutUpdate.statusCode).toBe(StatusCodes.OK);
	});

	test("Try to update fields of hut with error field capacity of Parking Lot", async () => {
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

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseCreateLocation = new ResponseHelper();
		const hut_test = await locationController.createLocation(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HUT_WORKER,
					email: "hut_worker@test.com",
					fullName: "John Doe",
				},
				body: {
					name: "A test hut",
					locationType: LocationType.HUT,
					description: "A test hut",
					point: [7.68307, 45.06837],
					phone: "332344435",
					email: "test@polito.it",
					webSite: "",
					altitude: 10,
					numberOfBeds: 15,
				},
			},
			responseCreateLocation
		);
		expect(responseCreateLocation.statusCode).toBe(StatusCodes.CREATED);

		const responseHutUpdate = new ResponseHelper();
		await locationController.updateLocation(
			{
				params: {
					id: hut_test.responseBody._id,
				},
				body: {
					locationType: LocationType.HUT,
					capacity: 20,
				},
			},
			responseHutUpdate
		);

		expect(responseHutUpdate.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});

	test("Try to update hut with empty fields", async () => {
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

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseCreateLocation = new ResponseHelper();
		const hut_test = await locationController.createLocation(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HUT_WORKER,
					email: "hut_worker@test.com",
					fullName: "John Doe",
				},
				body: {
					name: "A test hut",
					locationType: LocationType.HUT,
					description: "A test hut",
					point: [7.68307, 45.06837],
					phone: "332344435",
					email: "test@polito.it",
					webSite: "",
					altitude: 10,
					numberOfBeds: 15,
				},
			},
			responseCreateLocation
		);
		expect(responseCreateLocation.statusCode).toBe(StatusCodes.CREATED);

		const responseHutUpdate = new ResponseHelper();
		const hut_updated = await locationController.updateLocation(
			{
				params: {
					id: hut_test.responseBody._id,
				},
				body: {
					locationType: LocationType.HUT,
				},
			},
			responseHutUpdate
		);

		expect(hut_updated.responseBody.description).toBe("A test hut");
		expect(hut_updated.responseBody.numberOfBeds).toBe(15);
		expect(hut_updated.responseBody.email).toBe("test@polito.it");
		expect(hut_updated.responseBody.altitude).toBe(10);
		expect(responseHutUpdate.statusCode).toBe(StatusCodes.OK);
	});
});
