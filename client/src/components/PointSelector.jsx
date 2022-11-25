import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getLocations } from "../api/locations";

const PointSelector = ({ name, handleChange, value, isInvalid, multiple }) => {
	const [locations, setLocations] = useState([]);

	// ** Data fetching
	useEffect(() => {
		const fetchLocations = async () => {
			const locations = await getLocations();
			setLocations(locations.filter((location) => location.locationType !== "default")); // TODO: Filter on api query
		};
		fetchLocations();
	}, []);

	return (
		<Form.Select
			name={name}
			value={value}
			multiple={multiple}
			isInvalid={isInvalid}
			onChange={(e) => {
				const location = locations.find((l) => l._id === e.target.value);
				handleChange(location);
			}}
		>
			<option value="">Select a location</option>
			{locations.map((option) => (
				<option key={option._id} value={option._id}>
					{option.description}
				</option>
			))}
		</Form.Select>
	);
};

export default PointSelector;
