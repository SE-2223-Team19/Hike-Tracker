'use strict';
const userController = require("./user-controller");
const { StatusCodes } = require("http-status-codes");
const { UserType } = require("../models/enums");

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

describe('createUser', () => {

    test('insert user', async () => {
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
        console.log(response.responseBody);
        expect(response.statusCode).toBe(StatusCodes.CREATED);
    }, 20000); // May take some time for the encryption function

    test('error in schema', async () => {
        const response = new ResponseHelper();
        await userController.createUser({
            body: {
                email: "hiker.test.com", // Wrong email format
                fullName: "John Doe",
                userType: "Wrong type",
                password: "password",
                confirmPassword: "wrong password"
            }
        }, response);
        expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
});