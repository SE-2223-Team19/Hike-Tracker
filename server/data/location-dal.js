const { LocationType } = require("../models/enums");
const Hut = require("../models/hut-model");
const Location = require("../models/location-model");
const ParkingLot = require("../models/parking-lot-model");

/**
 * @typedef {Object} Location
 * @property {String} _id
 * @property {String} description
 * @property {[Number, Number]} point
 */

/**
 * Get all locations.
 * @param {*} filterQuery Filter object for MongoDB query
 * @param {Number} page The number of the page
 * @param {Number} pageSize The size of the page
 * @returns {Promise<Location>}
 */
async function getLocations(page, pageSize, filterQuery = {}) {
	const paginationActive = page !== undefined && pageSize !== undefined;
	let p = [];

	if (filterQuery.nearHike) {
		p = [
			...p,
			...filterQuery.nearHike
		];
		delete filterQuery.nearHike;
	}

	p = [ 
		...p,
		{
			$match: filterQuery,
		},
	];

	if (paginationActive) {
		p = [
			...p,
			{
				$facet: {
					data: [
						{
							$skip: (page - 1) * pageSize,
						},
						{
							$limit: pageSize,
						},
					],
					metadata: [
						{
							$count: "totalElements",
						},
						{
							$addFields: {
								type: "pagination",
								currentPage: page,
								pageSize: pageSize,
								totalPages: {
									$ceil: {
										$divide: ["$totalElements", pageSize],
									},
								},
							},
						},
					],
				},
			},
		];
	}

	const locations = await Location.aggregate(p);

	if (paginationActive) return locations[0];
	return locations;
}

/**
 * Gets a location by its id
 * @param {String} id
 * @returns {Promise<Location>}
 */
async function getLocationById(id) {
	const location = await Location.findById(id);
	return location;
}

/**
 * Create a new location.
 * @param {Location} location Location to create. Object must match Location model.
 * @returns {Promise<Location>}
 */
async function createLocation(location) {
	let newLocation = null;
	if (location.locationType === LocationType.HUT) {
		location.peopleWork = []
		newLocation = new Hut(location);
	} else if (location.locationType === LocationType.PARKING_LOT) {
		newLocation = new ParkingLot(location);
	} else {
		newLocation = new Location(location);
	}
	const savedLocation = await newLocation.save();
	return savedLocation;
}

/**
 * Updates the location's description
 * @param {String} id
 * @param {String} description
 * @returns {Promise<Location>}
 */
async function updateLocationDescription(id, description) {
	const result = await Location.updateOne({ id: id }, { description: description }, { new: true });
	return result;
}

/**
 *
 * @param {String} id
 * @param {Location || Hut || Parking_Lot} locationUpdate This function takes a location and then it calls the right update for a given
 * Location (The locationType should be passed to function in the updated object)
 * @returns
 */
async function updateLocation(id, locationUpdate) {
	if (locationUpdate.locationType === LocationType.HUT) {
		await Hut.findOneAndUpdate({ _id: id, locationType: LocationType.HUT }, locationUpdate, {
			new: true,
		}).lean();
	}
	if (locationUpdate.locationType === LocationType.PARKING_LOT) {
		await ParkingLot.findOneAndUpdate(
			{ _id: id, locationType: LocationType.PARKING_LOT },
			locationUpdate,
			{ new: true }
		).lean();
	}
	return await getLocationById(id);
}

module.exports = {
	getLocations,
	getLocationById,
	createLocation,
	updateLocationDescription,
	updateLocation,
};
