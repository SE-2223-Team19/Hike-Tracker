'use strict';
const locationController = require("./location-controller");
const { StatusCodes } = require("http-status-codes");
const { LocationType } = require("../models/enums");

function ResponseHelper() {
    this.statusCode = StatusCodes.OK;
    this.responseBody = {};
    this.status = (code) => {
        this.statusCode = code;
        return this;
    };
    this.json = (value) => {
        this.responseBody = value;
        return this;
    };
}

describe('getLocations', () => {

    test('get the first page', async () => {
        const response = new ResponseHelper();
        await locationController.getLocations({
            query: {
                filters: {},
                page: 1,
                pageSize: 50
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.OK);
    }, 10000);

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await locationController.getLocations({
            body: {
                filters: {
                    type: "Wrong Type"
                },
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
        console.log(response.responseBody);
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