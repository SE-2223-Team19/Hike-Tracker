const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
userRouter.get("/", userController.getUsers);
// userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
