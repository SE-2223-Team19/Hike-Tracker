const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);

module.exports = userRouter;
