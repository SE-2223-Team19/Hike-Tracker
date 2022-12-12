// Difficulty
const Difficulty = {
	TOURIST: "tourist",
	HIKER: "hiker",
	PROFESSIONAL_HIKER: "professional_hiker",
};

// Location type
const LocationType = {
	HUT: "hut",
	PARKING_LOT: "parking_lot",
	DEFAULT: "default", // No special location type, only gps coordinates
};

// User type
const UserType = {
	PLATFORM_MANAGER: "platform_manager",
	HIKER: "hiker",
	LOCAL_GUIDE: "local_guide",
	EMERGENCY_OPERATOR: "emergency_operator",
	HUT_WORKER: "hut_worker",
};

const HikeCondition = {
	OPEN : "open",
	OVERLOADED: "overloaded",
	CLOSE_BAD_WEATHER: "close_bad_weather",
	CLOSE_MAINTENANCE: "close_maintenance"
};

module.exports = {
	Difficulty,
	LocationType,
	UserType,
	HikeCondition,
};
