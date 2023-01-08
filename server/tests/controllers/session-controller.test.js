"use strict";
const sessionController = require("../../controllers/session-controller");
const { StatusCodes } = require("http-status-codes");
const { LocationType, UserType } = require("../../models/enums");
const { ResponseHelper } = require("../setup");

describe("session controller", () => {
    test("authenticated user returns session", async () => {
        const user = {
            _id: "testId",
            userType: "testUserType"
        };
        const response = await sessionController.getSession({
            user: user,
            isAuthenticated() {
                return true;
            }
        }, new ResponseHelper());
        expect(response.statusCode).toBe(StatusCodes.OK);
        expect(response.responseBody).toBe(user);
    });

    test("unauthenticated user returns unauthorized", async () => {
        const user = {
            _id: "testId",
            userType: "testUserType"
        };
        const response = await sessionController.getSession({
            user: user,
            isAuthenticated() {
                return false;
            }
        }, new ResponseHelper());
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    test("logout user", async () => {
        const response = new ResponseHelper();
        await sessionController.deleteSession({
            logout(cb) {
                cb();
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.OK);
    });
});