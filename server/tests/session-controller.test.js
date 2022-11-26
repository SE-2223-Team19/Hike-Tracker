'use strict';
const sessionController = require("../controllers/session-controller");
const userController = require("../controllers/user-controller");
const { StatusCodes } = require("http-status-codes");
const { UserType } = require("../models/enums");
const { setupDB, ResponseHelper } = require("./setup");

setupDB("session-controller");

describe('createSession', () => {

    test('create new session', async () => {
        const response = new ResponseHelper();
        await userController.createUser({
            body: {
                email: "hiker@test.com",
                fullName: "John Doe",
                userType: UserType.HIKER,
                password: "password",
                confirmPassword: "password"
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
        await sessionController.createSession({
            body: {
                email: "hiker@test.com",
                password: "password"
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    });

    test('error in credentials', async () => {
        const response = new ResponseHelper();
        await sessionController.createSession({
            body: {
                email: "hiker@test.com",
                password: "password"
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
});

