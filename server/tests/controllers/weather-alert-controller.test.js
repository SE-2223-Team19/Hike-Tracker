'use strict'
const weatherAlertcontroller = require("../../controllers/weather-alert-controller") 
const { StatusCodes } = require("http-status-codes");
const { UserType, WeatherCondition } = require("../../models/enums");
const { setupDB, ResponseHelper } = require("../setup");
const dotenv = require("dotenv");
const { updateWeatherAlert, createLocalGuide, createHike } = require("../sample-data");

dotenv.config();

setupDB("weather-alert-controller");

describe("createWeatherAlert", () => {
	test("insert weather", async () => {
		// Create local guide
		const localguideReponse = await createLocalGuide();

		// Create hike
		await createHike(localguideReponse);

		const response = await updateWeatherAlert(localguideReponse);

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