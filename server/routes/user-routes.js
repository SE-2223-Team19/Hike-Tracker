const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
userRouter.patch("/:id", userController.updateUser);

module.exports = userRouter;
