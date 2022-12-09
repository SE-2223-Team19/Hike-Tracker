const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

<<<<<<< HEAD
userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
=======
userRouter.get("/", userController.getUsers);
// userRouter.get("/:id", userController.getUser);
userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
userRouter.patch("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);
>>>>>>> origin/development

module.exports = userRouter;
