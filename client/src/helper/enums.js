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

const Hut_Condition={
	Open : "open",
	Overloaded: "overloaded",
	Close_BadWeather: "close_BadWeather",
	Close_maintenance: "close_maintenance"
}

module.exports = {
	Difficulty,
	LocationType,
	UserType,
	Hut_Condition
};
