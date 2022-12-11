const { StatusCodes } = require("http-status-codes");
const { UserType } = require("./models/enums");

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(StatusCodes.UNAUTHORIZED).end();
};

const isPlatformManager = (req, res, next) => {
	if (req.isAuthenticated() && req.user.userType === UserType.PLATFORM_MANAGER) {
		return next();
	}
	return res.status(StatusCodes.UNAUTHORIZED).end();
};

const isHiker = (req, res, next) => {
	if (
		req.isAuthenticated() &&
		(req.user.userType === UserType.HIKER || req.user.userType === UserType.PLATFORM_MANAGER)
	) {
		return next();
	}
	return res.status(StatusCodes.UNAUTHORIZED).end();
};

const isLocalGuide = (req, res, next) => {
	
	if (
		req.isAuthenticated() &&
		(req.user.userType === UserType.LOCAL_GUIDE || req.user.userType === UserType.PLATFORM_MANAGER)
	) {
		return next();
	}
	return res.status(StatusCodes.UNAUTHORIZED).end();
};

const isEmergencyOperator = (req, res, next) => {
	if (
		req.isAuthenticated() &&
		(req.user.userType === UserType.EMERGENCY_OPERATOR ||
			req.user.userType === UserType.PLATFORM_MANAGER)
	) {
		return next();
	}
	return res.status(StatusCodes.UNAUTHORIZED).end();
};

const isHutWorker = (req, res, next) => {
	if (
		req.isAuthenticated() &&
		(req.user.userType === UserType.HUT_WORKER || req.user.userType === UserType.PLATFORM_MANAGER)
	) {
		return next();
	}
	return res.status(StatusCodes.UNAUTHORIZED).end();
};



module.exports = {
	isLoggedIn,
	isPlatformManager,
	isHiker,
	isLocalGuide,
	isEmergencyOperator,
	isHutWorker
};
