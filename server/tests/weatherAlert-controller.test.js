'use strict'
const weatherAlertcontroller = require("../controllers/weatherAlert-controller") 
const { StatusCodes } = require("http-status-codes");
const { Difficulty, LocationType, UserType, WeatherCondition } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");
const { ObjectId } = require("mongodb");
const Location = require("../models/location-model");
const dotenv = require("dotenv");
const { updateWeatherAlert } = require("./sample-data");

dotenv.config();

setupDB("weatherAlert-controller");


describe("createWeatherAlert", () => {
	test("insert weather", async () => {
        const response = new ResponseHelper();
		 await updateWeatherAlert();

		expect(response.statusCode).toBe(StatusCodes.OK);

		
		await weatherAlertcontroller.updateWeatherAlert(
			{
                user: {
                    _id: response.responseBody.id,
                    userType: UserType.PLATFORM_MANAGER,
                    email: "hiker@test_PlatformManager@test.it.com",
                    fullName: "test_PlatformManager@test.it",
                },
                body: {
                    weatherAlert: WeatherCondition.BLIZZARD,
                    radius:50,
                    coordinates: [
                        [45.177786, 7.083372],
                        [45.177913, 7.083268],
                        [45.178044, 7.083159],
                    ],
                },
            },
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await weatherAlertcontroller.updateWeatherAlert(
			{
				body: {
					weatherAlert: WeatherCondition.BLIZZARD,
                    radius:50,
					// missing a field
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});