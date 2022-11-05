const mongoose = require("mongoose");
const { Schema } = mongoose;
const { UserType } = require("./enums");

// User Schema
const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	fullName: String,
	userType: { type: String, enum: Object.values(UserType) },
	// Password fields
	salt: String,
	hash: String,
});

// User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
