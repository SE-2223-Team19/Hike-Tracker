const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
//const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const MONGO_URI = process.env.MONGO_URI;

const runDb = () => {
	mongoose.connect(MONGO_URI);

	// Connection events
	mongoose.connection.on("connected", () => {
		console.log("Mongoose connected to " + MONGO_URI);
	});

	mongoose.connection.on("error", (err) => {
		console.log("Mongoose connection error: " + err);
	});

	mongoose.connection.on("disconnected", () => {
		console.log("Mongoose disconnected");
	});
};

module.exports = runDb;
