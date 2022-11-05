const mongoose = require("mongoose");

const MONGO_URI =
	process.env.MONGO_URI ||
	"mongodb+srv://mongo:dLyEjRm70XkaZ03A@hike-tracker-cluster0.xbf6slx.mongodb.net/hike-tracker?retryWrites=true&w=majority";

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
