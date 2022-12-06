const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");

// userRouter.get("/", userController.getUsers);
// userRouter.get("/:id", userController.getUser);
userRouter.post("/", userController.createUser);
userRouter.post("/verify/:uniqueString", userController.verifyUser);
userRouter.get("/preferences", userController.getPreferences);
userRouter.patch("/preferences", userController.updatePreferences);
userRouter.delete("/preferences", userController.deletePreferences);
// userRouter.patch("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
