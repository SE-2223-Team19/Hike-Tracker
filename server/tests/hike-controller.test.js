'use strict';
const hikeController = require("../controllers/hike-controller");
const { StatusCodes } = require("http-status-codes");
const { Difficulty, LocationType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");

setupDB("hike-controller");

describe('getHikes', () => {

    test('get the first page', async () => {
        const response = new ResponseHelper();
        await hikeController.getHikes({
            query: {
                page: 1,
                pageSize: 50
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.OK);
    });

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await hikeController.getHikes({
            query: {
                difficulty: "Wrong difficulty",
                locationCoordinates: [12, 12, 12],
                locationRadius: -1,
                page: 0,
                pageSize: 50
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});

describe('createHike', () => {

    test('insert hike', async () => {
        const response = new ResponseHelper();
        await hikeController.createHike({
            body: {
                title: "Test hike",
                length: 12000, // 12 km
                ascent: 200, // 200 m
                expectedTime: 60 * 3, // 3 h
                difficulty: Difficulty.HIKER,
                description: "A test hike",
                startPoint: {
                    locationType: LocationType.PARKING_LOT,
                    description: "Starting point",
                    point: [12, 90]
                },
                endPoint: {
                    locationType: LocationType.PARKING_LOT,
                    description: "Ending point",
                    point: [13, 90]
                },
                referencePoints: []
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await hikeController.createHike({
            body: {
                title: "Test hike",
                length: 12000, // 12 km
                ascent: 200, // 200 m
                expectedTime: 60 * 3, // 3 h
                difficulty: Difficulty.HIKER
                // missing a field
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});