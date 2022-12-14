"use strict";
const hikeController = require("../../controllers/hike-controller");
const locationController = require("../../controllers/location-controller");
const { StatusCodes } = require("http-status-codes");
const { Difficulty, LocationType, UserType, HikeCondition } = require("../../models/enums");
const { setupDB, ResponseHelper } = require("../setup");
const { ObjectId } = require("mongodb");
const Location = require("../../models/location-model");
const dotenv = require("dotenv");
const { createLocalGuide, createHiker, createHike } = require("../sample-data");

dotenv.config();

setupDB("hike-controller");

const trackPoints = [
	[45.177786, 7.083372],
	[45.177913, 7.083268],
	[45.178044, 7.083159],
	[45.178199, 7.083081],
	[45.178361, 7.083018],
	[45.178477, 7.082895],
	[45.178591, 7.082727],
	[45.178753, 7.082619],
	[45.1789, 7.082514],
	[45.179071, 7.082438],
	[45.179219, 7.082347],
	[45.179408, 7.082283],
	[45.179555, 7.082232],
	[45.179709, 7.082178],
	[45.17988, 7.082138],
	[45.180032, 7.082123],
	[45.179965, 7.081954],
	[45.179794, 7.081847],
	[45.179613, 7.081837],
	[45.179442, 7.081813],
	[45.179302, 7.081776],
	[45.179147, 7.081767],
	[45.178983, 7.081805],
	[45.178973, 7.081613],
	[45.179072, 7.081462],
	[45.179168, 7.081302],
	[45.179274, 7.081145],
	[45.179379, 7.081016],
	[45.179503, 7.080876],
	[45.17962, 7.080775],
	[45.179767, 7.080731],
	[45.179905, 7.080712],
	[45.179993, 7.080565],
	[45.18011, 7.080454],
	[45.180232, 7.080372],
	[45.180365, 7.08034],
	[45.180497, 7.080269],
	[45.180521, 7.080063],
	[45.180643, 7.079972],
	[45.180735, 7.079806],
	[45.180816, 7.079643],
	[45.180923, 7.079512],
	[45.18102, 7.079377],
	[45.181114, 7.079234],
	[45.181242, 7.079153],
	[45.181377, 7.079153],
	[45.181513, 7.079161],
	[45.181642, 7.079087],
	[45.181729, 7.078928],
	[45.181823, 7.078789],
	[45.18195, 7.078664],
	[45.182043, 7.07852],
	[45.182174, 7.078446],
	[45.182314, 7.078399],
	[45.182428, 7.078282],
	[45.182498, 7.078118],
	[45.182637, 7.078194],
	[45.182706, 7.078022],
	[45.182797, 7.077876],
	[45.182932, 7.077827],
	[45.182968, 7.078025],
	[45.183052, 7.078189],
	[45.183144, 7.07833],
	[45.183251, 7.078447],
	[45.183322, 7.078284],
	[45.183375, 7.078098],
	[45.183451, 7.077939],
	[45.18353, 7.078105],
	[45.183628, 7.078248],
	[45.183728, 7.078386],
	[45.183833, 7.078506],
	[45.183951, 7.078624],
	[45.184068, 7.078728],
	[45.184202, 7.078783],
	[45.184339, 7.078848],
	[45.184438, 7.078983],
	[45.184553, 7.079116],
	[45.184664, 7.079234],
	[45.184772, 7.07935],
	[45.184888, 7.079466],
	[45.184997, 7.079585],
	[45.185116, 7.079694],
	[45.185227, 7.079831],
	[45.185318, 7.079987],
	[45.18544, 7.080074],
	[45.185556, 7.080176],
	[45.185665, 7.080294],
	[45.185801, 7.080396],
	[45.185938, 7.080447],
	[45.186072, 7.080475],
	[45.186205, 7.080438],
	[45.186342, 7.08042],
	[45.186459, 7.08032],
	[45.186563, 7.080197],
	[45.186677, 7.08009],
	[45.186803, 7.080018],
	[45.186675, 7.079931],
	[45.1866, 7.079772],
	[45.186567, 7.079574],
	[45.186616, 7.07939],
	[45.186754, 7.079401],
	[45.186816, 7.079224],
	[45.186797, 7.079024],
	[45.186755, 7.078829],
	[45.186894, 7.078815],
	[45.186982, 7.07866],
	[45.187118, 7.07869],
	[45.18722, 7.07856],
	[45.187209, 7.078366],
	[45.187345, 7.07836],
	[45.187302, 7.078173],
	[45.187265, 7.077985],
	[45.187347, 7.077818],
	[45.187309, 7.077625],
	[45.187411, 7.077766],
	[45.18749, 7.077609],
	[45.18751, 7.077406],
	[45.187645, 7.077378],
	[45.187688, 7.077191],
	[45.187706, 7.076998],
	[45.187822, 7.077102],
	[45.187958, 7.077157],
	[45.188082, 7.077035],
	[45.188103, 7.076841],
	[45.188244, 7.0768],
	[45.18838, 7.076775],
	[45.188494, 7.076663],
	[45.18858, 7.076498],
	[45.188607, 7.076307],
	[45.188668, 7.076128],
	[45.188718, 7.075937],
	[45.188852, 7.075977],
	[45.188912, 7.07616],
	[45.189032, 7.076255],
	[45.189157, 7.076338],
	[45.189286, 7.07627],
	[45.189338, 7.076089],
	[45.189371, 7.075899],
	[45.189502, 7.075948],
	[45.189633, 7.076018],
	[45.189765, 7.076064],
	[45.189819, 7.075881],
	[45.189838, 7.07569],
	[45.189826, 7.075494],
	[45.189856, 7.075302],
	[45.189981, 7.075386],
	[45.190058, 7.075548],
	[45.190128, 7.075364],
	[45.190185, 7.075184],
	[45.190302, 7.07528],
	[45.190412, 7.075408],
	[45.190543, 7.075484],
	[45.190661, 7.075587],
	[45.190782, 7.075677],
	[45.190917, 7.075714],
	[45.190892, 7.075519],
	[45.191032, 7.075506],
	[45.191157, 7.075587],
	[45.191115, 7.075398],
	[45.191014, 7.075251],
	[45.190916, 7.075108],
	[45.190838, 7.074947],
	[45.19097, 7.074902],
	[45.191085, 7.0748],
	[45.191203, 7.074897],
	[45.191333, 7.07495],
	[45.191469, 7.074935],
	[45.191613, 7.07499],
	[45.191735, 7.075075],
	[45.191877, 7.075048],
	[45.192014, 7.075058],
	[45.192151, 7.075044],
	[45.192282, 7.075094],
	[45.192416, 7.075136],
	[45.192542, 7.075207],
	[45.192677, 7.075244],
	[45.192822, 7.075254],
	[45.192955, 7.07529],
	[45.193094, 7.07531],
	[45.19323, 7.075341],
	[45.193359, 7.075421],
	[45.193491, 7.075469],
	[45.193606, 7.075571],
	[45.193735, 7.075631],
	[45.193868, 7.075669],
	[45.194005, 7.075736],
	[45.194122, 7.075834],
	[45.194218, 7.075977],
	[45.194324, 7.076105],
	[45.194411, 7.076264],
	[45.194496, 7.076444],
	[45.194594, 7.076583],
	[45.194655, 7.07676],
	[45.194695, 7.076953],
	[45.194768, 7.077119],
	[45.194887, 7.077222],
	[45.194964, 7.077386],
	[45.195067, 7.077521],
	[45.195173, 7.077666],
	[45.195287, 7.077779],
	[45.195382, 7.077921],
	[45.195479, 7.078059],
	[45.19556, 7.078219],
	[45.195629, 7.078391],
	[45.195721, 7.078536],
	[45.19584, 7.078639],
	[45.195952, 7.078751],
	[45.19607, 7.078851],
	[45.196195, 7.078937],
	[45.196261, 7.078767],
	[45.196203, 7.07858],
	[45.196201, 7.078385],
	[45.196197, 7.078185],
	[45.196232, 7.077997],
	[45.19622, 7.077804],
	[45.196211, 7.077612],
	[45.196204, 7.077418],
	[45.196342, 7.077439],
	[45.196429, 7.077277],
	[45.196427, 7.077084],
	[45.196441, 7.076888],
	[45.196424, 7.076697],
	[45.196469, 7.076515],
	[45.196494, 7.076327],
	[45.19648, 7.076137],
	[45.196534, 7.075955],
	[45.196552, 7.07576],
	[45.196625, 7.075598],
	[45.196639, 7.075403],
	[45.196633, 7.075209],
	[45.196647, 7.075015],
	[45.196784, 7.07501],
	[45.196931, 7.075053],
	[45.197021, 7.075207],
	[45.197137, 7.075313],
	[45.19725, 7.075434],
	[45.197352, 7.075564],
	[45.19745, 7.075702],
	[45.197561, 7.075831],
	[45.197616, 7.076012],
	[45.197672, 7.076189],
	[45.197711, 7.076389],
	[45.197809, 7.076523],
	[45.197851, 7.076712],
	[45.197987, 7.076707],
	[45.198057, 7.076538],
	[45.198188, 7.076493],
	[45.19829, 7.076367],
	[45.198428, 7.076377],
	[45.198557, 7.076317],
	[45.198598, 7.076134],
	[45.198735, 7.076138],
	[45.198809, 7.076299],
	[45.198912, 7.076174],
	[45.199028, 7.076273],
	[45.199162, 7.076306],
	[45.19927, 7.076428],
	[45.199408, 7.0764],
	[45.199553, 7.076434],
	[45.199696, 7.076472],
	[45.199835, 7.076491],
	[45.199967, 7.076569],
	[45.200099, 7.076528],
	[45.200233, 7.076568],
	[45.200364, 7.07649],
	[45.200499, 7.076499],
	[45.200638, 7.07653],
	[45.200774, 7.076559],
	[45.200913, 7.076581],
	[45.201046, 7.076616],
	[45.201178, 7.076674],
	[45.201304, 7.076756],
	[45.201425, 7.076842],
	[45.20156, 7.076884],
	[45.201692, 7.076935],
	[45.201818, 7.077012],
	[45.201947, 7.07707],
	[45.202083, 7.07708],
	[45.202179, 7.077223],
	[45.202317, 7.07727],
	[45.202448, 7.077315],
	[45.202506, 7.077139],
	[45.202642, 7.077172],
	[45.202769, 7.077106],
	[45.202882, 7.077219],
	[45.202982, 7.077359],
	[45.203121, 7.077322],
	[45.203248, 7.077385],
	[45.203355, 7.077507],
	[45.203491, 7.077485],
	[45.203388, 7.077354],
	[45.203531, 7.07734],
]

describe("getHikes", () => {
	test("get the first page", async () => {
		const response = new ResponseHelper();
		await hikeController.getHikes(
			{
				query: {
					page: 1,
					pageSize: 50,
					minLength: 1,
					maxLength: 2,
					minAscent: 3,
					maxAscent: 4,
					minExpectedTime: 10,
					maxExpectedTime: 15,
					difficulty: Difficulty.HIKER
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.OK);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await hikeController.getHikes(
			{
				query: {
					difficulty: "Wrong difficulty",
					locationCoordinatesLat: 12,
					locationCoordinatesLon: 2,
					locationRadius: -1,
					page: 0,
					pageSize: 50,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});

describe("getHikeById", () => {
	test("get hike by id", async () => {
		const responseUserCreation = await createLocalGuide();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const response = new ResponseHelper();

		await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.LOCAL_GUIDE,
					email: "localguide@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [],
					trackPoints: trackPoints,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
		const responseHike = new ResponseHelper();
		await hikeController.getHikeById(
			{
				params: {
					id: response.responseBody._id,
				},
			},
			responseHike
		);
		expect(responseHike.statusCode).toBe(StatusCodes.OK);
	});

	test("error in id", async () => {
		const response = new ResponseHelper();
		await hikeController.getHikeById(
			{
				params: {
					id: -1, //invalid value of id
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
	test("hike not found", async () => {
		const response = new ResponseHelper();
		await hikeController.getHikeById(
			{
				params: {
					id: new ObjectId("123456789012"), //wrong value
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
	});
});

describe("createHike", () => {
	test("insert hike", async () => {
		const responseUserCreation = await createHiker();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const response = new ResponseHelper();
		await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [],
					trackPoints: trackPoints,
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.CREATED);
	});

	test("error in schema", async () => {
		const response = new ResponseHelper();
		await hikeController.createHike(
			{
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					// missing a field
				},
			},
			response
		);
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
	});
});

describe("update Hike", () => {

	test('Test Update Hike Condition', async() => {
		const responseUserCreation = await createLocalGuide();
		const responseHikeCreation = await createHike(responseUserCreation);
		const response = new ResponseHelper();

		await hikeController.updateHikeCondition({
			params: {id: responseHikeCreation.responseBody._id},
			body: {hikeCondition: HikeCondition.OPEN}
		}, response)

		
		expect(response.statusCode).toBe(StatusCodes.OK);

	});

	test('Test Update Hike Condition', async() => {
		const responseUserCreation = await createLocalGuide();
		const responseHikeCreation = await createHike(responseUserCreation);
		const response = new ResponseHelper();

		await hikeController.updateHikeCondition({
			params: {id: responseHikeCreation.responseBody._id},
			body: {hikeCondition: 0}
		}, response)

		
		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);

	});


	test("update a single field (like title)", async () => {
		const responseUserCreation = await createHiker();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeCreation = new ResponseHelper();
		const hike = await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [],
					trackPoints: trackPoints,
				},
			},
			responseHikeCreation
		);

		expect(responseHikeCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeUpdate = new ResponseHelper();
		const hikeUpdated = await hikeController.updateHike(
			{
				params: {
					id: hike.responseBody._id.toString(),
				},
				body: {
					title: "Test Update Hike",
				},
			},
			responseHikeUpdate
		);

		expect(hikeUpdated.responseBody.title).toBe("Test Update Hike");
		expect(responseHikeUpdate.statusCode).toBe(StatusCodes.OK);
	});

	test("update array field (like trackPoints) as an adding new Point", async () => {
		const responseUserCreation = await createHiker();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeCreation = new ResponseHelper();
		const hike = await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [],
					trackPoints: trackPoints,
				},
			},
			responseHikeCreation
		);

		expect(responseHikeCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeUpdate = new ResponseHelper();
		const newTrackPoints = [
			[1, 2],
			[3, 4],
			[5, 6],
		];
		await hikeController.updateHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				params: {
					id: hike.responseBody._id.toString(),
				},
				body: {
					trackPoints: newTrackPoints,
				},
			},
			responseHikeUpdate
		);

		newTrackPoints.reverse();
		for (let i = 0; i < newTrackPoints.length; i++) {
			let trackPoint =
				responseHikeUpdate.responseBody.trackPoints[
					responseHikeUpdate.responseBody.trackPoints.length - (1 + i)
				];
			expect(newTrackPoints[i]).toStrictEqual(trackPoint);
		}

		expect(responseHikeUpdate.statusCode).toBe(StatusCodes.OK);
	});

	test("update an object type as Location", async () => {
		const responseUserCreation = await createHiker();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeCreation = new ResponseHelper();
		await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [],
					trackPoints: trackPoints,
				},
			},
			responseHikeCreation
		);

		const responseHikeUpdate = new ResponseHelper();

		const location1 = [45.203531, 7.07734];

		const location2 = [45.203388, 7.077354];

		const hikeUpdated = await hikeController.updateHike(
			{
				params: {
					id: responseHikeCreation.responseBody._id.toString(),
				},
				body: {
					referencePoints: [location1, location2],
				},
			},
			responseHikeUpdate
		);

		expect(hikeUpdated.responseBody.referencePoints.length).toBe(2);
		expect(responseHikeUpdate.statusCode).toBe(StatusCodes.OK);
	});

	test("update startPoint", async () => {
		const responseUserCreation = await createHiker();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeCreation = new ResponseHelper();
		await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [],
					trackPoints: trackPoints,
				},
			},
			responseHikeCreation
		);

		const responseCreateLocation = new ResponseHelper();
		await locationController.createLocation(
			{
				user: {
					userType: UserType.LOCAL_GUIDE,
				},
				body: {
					locationType: LocationType.DEFAULT,
					description: "Example starting point",
					point: [7.083372, 45.177786],
				},
			},
			responseCreateLocation
		);

		expect(responseCreateLocation.statusCode).toBe(StatusCodes.CREATED);
		const responseHikeUpdate = new ResponseHelper();
		let startPoint = responseCreateLocation.responseBody

		const hikeUpdated = await hikeController.updateHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id.toString(),
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				params: {
					id: responseHikeCreation.responseBody._id.toString(),
				},
				body: {
					startPoint: startPoint._id.toString(),
				},
			},
			responseHikeUpdate
		);

		const startPointUpdated = await Location.findById(
			hikeUpdated.responseBody.startPoint._id.toString()
		);

		expect(startPointUpdated.locationType).toBe(startPoint.locationType);
		expect(startPointUpdated.description).toBe(startPoint.description);
		expect(startPointUpdated.point[1]).toBe(startPoint.point[1]);
		expect(startPointUpdated.point[0]).toBe(startPoint.point[0]);

		expect(responseHikeUpdate.statusCode).toBe(StatusCodes.OK);
	});

	test("add new reference points to Hike", async () => {
		const responseUserCreation = await createLocalGuide();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeCreation = new ResponseHelper();

		const hike = await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.LOCAL_GUIDE,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [
						[45.178477, 7.082895],
						[45.17988, 7.082138],
						[45.178983, 7.081805],
					],
					trackPoints: trackPoints,
				},
			},
			responseHikeCreation
		);

		expect(responseHikeCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeUpdate = new ResponseHelper();
		const referencePointsToAdd = [
			[45.203491, 7.077485],
			[45.202448, 7.077315],
			[45.202982, 7.077359],
		];

		const hikeUpdated = await hikeController.updateHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id.toString(),
					userType: UserType.HIKER,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				params: {
					id: hike.responseBody._id.toString(),
				},
				body: {
					referencePoints: referencePointsToAdd,
				},
			},
			responseHikeUpdate
		);

		expect(hikeUpdated.responseBody.referencePoints.length).toBe(3);
		expect(responseHikeUpdate.statusCode).toBe(StatusCodes.OK);
	});

	test("Delete Hike", async () => {
		const responseUserCreation = await createLocalGuide();

		expect(responseUserCreation.statusCode).toBe(StatusCodes.CREATED);

		const responseHikeCreation = new ResponseHelper();

		const hike = await hikeController.createHike(
			{
				user: {
					_id: responseUserCreation.responseBody._id,
					userType: UserType.LOCAL_GUIDE,
					email: "hiker@test.com",
					fullName: "John Doe",
				},
				body: {
					title: "Test hike",
					length: 12000, // 12 km
					ascent: 200, // 200 m
					expectedTime: 60 * 3, // 3 h
					difficulty: Difficulty.HIKER,
					description: "A test hike",
					startPoint: null,
					endPoint: null,
					referencePoints: [
						[45.178477, 7.082895],
						[45.17988, 7.082138],
						[45.178983, 7.081805],
					],
					trackPoints: trackPoints,
				},
			},
			responseHikeCreation
		);

		expect(responseHikeCreation.statusCode).toBe(StatusCodes.CREATED);
		
		const responseDelete = new ResponseHelper();
		await hikeController.deleteHike({
			params: { id: hike.responseBody._id }
		}, responseDelete);

		expect(responseDelete.statusCode).toBe(StatusCodes.OK);
	});

	test("Delete Hike Fail", async () => {

		const responseDelete = new ResponseHelper();
		await hikeController.deleteHike({
			params: {id: 20}
		}, responseDelete);

		expect(responseDelete.statusCode).toBe(StatusCodes.BAD_REQUEST);
	})

});
