'use strict';
const locationController = require("../controllers/location-controller");
const locationService = require("")
const { StatusCodes } = require("http-status-codes");
const { LocationType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");

setupDB("location-controller");

describe('getLocations', () => {

    test('get all', async () => {
        const response = new ResponseHelper();
        await locationController.getLocations({
            query: {}
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
                locationType: LocationType.DEFAULT,
                description: "A test default location",
                point: [7.683070, 45.068370] // Wants a <longitude>, <latitude> array
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });

    
    test('insert parking coordination', async () => {
        const response = new ResponseHelper();
        await locationController.createLocation({
            body: {
                name: "A parking lot",
                locationType: LocationType.PARKING_LOT,
                description: "A test parking lot",
                capacity: 20,
                point: [32.5, 18.1] 
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });

    test('insert parking coordination', async () => {
        const response = new ResponseHelper();
        await locationController.createLocation({
            body: {
                locationType: LocationType.PARKING_LOT,
                description: "A test parking lot",
                point: ['aaaaaa', 18.1] 
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
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

describe('updateLocationDescription', () => {

    test('update location', async () => {
        const response = new ResponseHelper();
        await locationController.createLocation({
            body: {
                locationType: LocationType.DEFAULT,
                description: "A test hut",
                point: [7.683070, 45.068370] // Wants a <longitude>, <latitude> array
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        await locationController.updateLocationDescription({
            params: {
                id: response.responseBody._id
            },
            body: {
                description: "A test hut updated"
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.OK);
    });

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await locationController.createLocation({
            body: {
                locationType: LocationType.DEFAULT,
                description: "A test hut",
                point: [7.683070, 45.068370]
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        await locationController.updateLocationDescription({
            params: {
                id: response.responseBody._id
            },
            body: {
                description: 123
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});

describe('update Hut Informations', () => {

    // test('Try to update a field of hut', async () => {
        
    //     const responseCreateLocation = new ResponseHelper()
    //     await locationController.createLocation({
    //         body: {
    //             locationType: LocationType.HUT,
    //             description: "A test hut",
    //             point: [7.683070, 45.068370]
    //         }
    //     }, responseCreateLocation);
    //     expect(responseCreateLocation.statusCode).toBe(StatusCodes.CREATED);
    // })
})