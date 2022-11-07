const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const runDb = require("./db");
const appRouter = require("./router");
const passport = require("passport");
const { localStrategy } = require("./passport-strategy");

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
	passport.use(localStrategy);

	passport.serializeUser(function (user, cb) {
		cb(null, user);
	});

	passport.deserializeUser(function (user, cb) {
		// this user is id + email + name
		return cb(null, user);
		// if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
	});

	app.use(
		session({
			secret: "shhhhh... it's a secret!",
			resave: false,
			saveUninitialized: false,
		})
	);
	app.use(passport.authenticate("session"));

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
