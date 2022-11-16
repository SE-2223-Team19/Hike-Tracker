// import React, { useEffect, useState } from "react";
// import { Button, ButtonGroup, Form, Stack, ToggleButton } from "react-bootstrap";
// import { getLocations } from "../api/locations";

// /**
//  * AddPointForm
//  *
//  * User can select a point from
//  * - List of available points (saved locations like hut, parking, etc.)
//  * - Coordinates
//  * - Click on map (?)
//  */

// const AddPointForm = ({ label, setPoint }) => {
// 	// ** UI Form state
// 	const [addPointFromCoordinates, setAddPointFromCoordinates] = useState(false);

// 	// ** Data state
// 	const [lat, setLat] = useState();
// 	const [lng, setLng] = useState();
// 	const [locations, setLocations] = useState([]);

// 	// ** Data fetching
// 	useEffect(() => {
// 		const fetchLocations = async () => {
// 			const locations = await getLocations();
// 			setLocations(locations.filter((location) => location.locationType !== "default")); // TODO: Filter on api query
// 		};
// 		fetchLocations();
// 	}, []);

// 	// ** Format point
// 	const formatPoint = () => {
// 		if (!validatePoints(lat, lng)) {
// 			console.log("Invalid point");
// 			return;
// 		}
// 		setPoint([lat, lng]);
// 	};

// 	const validateCoord = (coord) => {
// 		if (!coord) {
// 			return false;
// 		}
// 		// If the input is not a number, return false
// 		if (isNaN(coord)) {
// 			return false;
// 		}
// 		// If the input is not between -90 and 90 for latitude and -180 and 180 for longitude, return false
// 		if (coord < -90 || coord > 90) {
// 			return false;
// 		}
// 		return true;
// 	};

// 	return (
// 		<Form className="mb-3" noValidate>
// 			<Form.Label>{label}</Form.Label>
// 			<Stack gap={3}>
// 				<ButtonGroup className="w-100">
// 					<ToggleButton
// 						id={`toggle-${label}-locations`}
// 						variant="outline-success"
// 						type="checkbox"
// 						name="radio"
// 						checked={!addPointFromCoordinates}
// 						value={false}
// 						onChange={(e) => setAddPointFromCoordinates(false)}
// 					>
// 						Choose from locations
// 					</ToggleButton>
// 					<ToggleButton
// 						id={`toggle-${label}-coordinates`}
// 						variant="outline-success"
// 						type="checkbox"
// 						name="radio"
// 						value={true}
// 						checked={addPointFromCoordinates}
// 						onChange={(e) => setAddPointFromCoordinates(true)}
// 					>
// 						Insert coordinates
// 					</ToggleButton>
// 				</ButtonGroup>
// 				{!addPointFromCoordinates && (
// 					<Stack direction="horizontal" gap={3} className="align-items-start">
// 						<Stack>
// 							<Form.Select
// 								placeholder="Choose from saved locations"
// 								onChange={(e) => {
// 									const arrayPoint = e.target.value.split(",").map((coord) => parseFloat(coord));
// 									console.log(arrayPoint);
// 									setLat(arrayPoint[0]); // String of coordinates separated by comma
// 									setLng(arrayPoint[1]); // String of coordinates separated by comma
// 								}}
// 							>
// 								<option>Choose from saved locations</option>
// 								{locations.map((location) => (
// 									<option key={location._id} value={location.point}>
// 										{location.locationType}
// 									</option>
// 								))}
// 							</Form.Select>
// 							<Form.Control.Feedback type="invalid">Invalid point</Form.Control.Feedback>
// 						</Stack>
// 						<Button variant="success" onClick={() => formatPoint()}>
// 							Add
// 						</Button>
// 					</Stack>
// 				)}
// 				{addPointFromCoordinates && (
// 					<Stack gap={3}>
// 						<Stack direction="horizontal" gap={2}>
// 							<Form.Control
// 								isValid={validLat}
// 								isInvalid={!validLat}
// 								placeholder="Latitude"
// 								onChange={(e) => setLat(e.target.value)}
// 							/>
// 							<Form.Control
// 								isValid={validLng}
// 								isInvalid={!validLng}
// 								placeholder="Longitude"
// 								onChange={(e) => setLng(e.target.value)}
// 							/>
// 							<Button variant="success" onClick={() => formatPoint()}>
// 								Add
// 							</Button>
// 						</Stack>
// 					</Stack>
// 				)}
// 			</Stack>
// 		</Form>
// 	);
// };

// export default AddPointForm;
