'use strict';
const locationController = require("../controllers/location-controller");
const { StatusCodes } = require("http-status-codes");
const { LocationType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");

setupDB("location-controller");

describe('getLocations', () => {

    test('get the first page', async () => {
        const response = new ResponseHelper();
        await locationController.getLocations({
            query: {
                page: 1,
                pageSize: 50
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.OK);
    });

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await locationController.getLocations({
            query: {
                type: "Wrong Type",
                page: 0,
                pageSize: 50
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});

describe('createLocation', () => {

    test('insert location', async () => {
        const response = new ResponseHelper();
        await locationController.createLocation({
            body: {
                locationType: LocationType.HUT,
                description: "A test hut",
                point: [7.683070, 45.068370] // Wants a <longitude>, <latitude> array
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await locationController.createLocation({
            body: {
                type: LocationType.HUT,
                description: "A test hut",
                point: [7.683070, 45.068370, 12.123] // Wrong array length
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});