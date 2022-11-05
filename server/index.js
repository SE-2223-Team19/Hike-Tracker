const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const runDb = require("./db");
const appRouter = require("./router");

// Constants
const PORT = process.env.SERVER_PORT || 8080;

// Express app setup
const getApp = () => {
	// Load environment variables from .env file
	dotenv.config({ path: path.join(__dirname, ".env") });

	// Create Express server
	const app = express();
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Router
	app.use("/api", appRouter);

	// Passport configuration

	return app;
};

// Server setup and start
const startServer = () => {
	const app = getApp();
	const db = runDb();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();
