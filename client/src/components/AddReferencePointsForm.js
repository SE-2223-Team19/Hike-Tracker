import React from "react";
import { Button, Form, Stack } from "react-bootstrap";
import AddPointForm from "./AddPointForm";

const AddReferencePointsForm = ({ setPoints, points }) => {
	const addPoint = (point) => {
		setPoints([...points, point]);
	};

	const removePoint = (point) => {
		setPoints(points.filter((p) => p !== point));
	};

	return (
		<Form.Group>
			<Form.Label htmlFor="referencePoints">Reference Points</Form.Label>
			{/** Reference Points List */}
			<ol className="mt-3">
				{points.map((point, index) => {
					return (
						<li key={index} className="mb-3">
							<Stack direction="horizontal" className="align-items-center justify-content-between">
								<p>
									Lat: {point[0]}, Long: {point[1]}
								</p>
								<Button variant="outline-danger" onClick={() => removePoint(point)}>
									Remove
								</Button>
							</Stack>
						</li>
					);
				})}
			</ol>
			<AddPointForm label="" setPoint={addPoint} />
		</Form.Group>
	);
};

export default AddReferencePointsForm;
