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
	// verification fields:
	uniqueString: { type: String, unique: true },
	isEmailValidated: Boolean,
	isValid: Boolean,
	preferences: { minLength: Number, maxLength: Number, minAscent: Number, maxAscent: Number, minExpectedTime: Number, maxExpectedTime: Number, difficulty: String, locationCoordinatesLat: Number, locationCoordinatesLng: Number, locationRadius: Number }
});

// User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
