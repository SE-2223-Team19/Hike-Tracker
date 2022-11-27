const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
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
	// set up and enable cors
	const corsOptions = {
		origin: 'http://localhost:3000',
		optionsSuccessStatus: 200,
		credentials: true,
	};
	app.use(morgan("dev"));
	app.use(cors(corsOptions));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(
		session({
			secret: "shhhhh... it's a secret!",
			resave: false,
			saveUninitialized: false,
		})
	);

	app.use(passport.session());
	// Passport configuration
	passport.use(localStrategy);

	passport.serializeUser(function (user, cb) {
		return cb(null, user);
	});

	passport.deserializeUser(function (user, cb) {
		// this user is id + email + name
		return cb(null, user);
		// if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
	});

	// Router
	app.use("/api", appRouter);

	return app;
};

// Server setup and start
const startServer = async () => {
	const app = getApp();
	await runDb();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();
