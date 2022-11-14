'use strict';
const hikeController = require("./hike-controller");
const { StatusCodes } = require("http-status-codes");
const { Difficulty } = require("../models/enums");

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

describe('getHikes', () => {

    test('get the first page', async () => {
        const response = new ResponseHelper();
        await hikeController.getHikes({
            query: {
                filters: {},
                page: 1,
                pageSize: 50
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.OK);
    }, 20000);

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await hikeController.getHikes({
            query: {
                filters: {
                    difficulty: "Wrong difficulty",
                    location: {
                        coordinates: [12, 12, 12],
                        radius: -1
                    }
                },
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
                startPoint: "123413234",
                endPoint: "456789"
            }
        }, response);
        console.log(response.responseBody);
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