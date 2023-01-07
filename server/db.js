const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// These variables are defined in .env, in case there is no .env file, we use the default values
const MONGO_HOST = process.env.MONGO_HOST || "mongo";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_DB = process.env.MONGO_DB || "hike-tracker";

const MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;



const runDb = async () => {
	await mongoose.connect(MONGO_URI)
		.then(() => {
			console.log("Mongoose connected to " + MONGO_URI);
		})
		.catch((err) => {
			console.log("Mongoose connection error: " + err);
		});

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
