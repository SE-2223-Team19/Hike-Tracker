import { createLocation } from "../api/locations";
import { useState } from "react";
import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { LocationType } from "../helper/enums";
import PositionSelectorModal from "./PositionSelectorModal";
import { useNavigate } from "react-router-dom";

function DescribeHutForm() {
	const navigate = useNavigate();

	const [descriptions, setdescriptions] = useState("Hut Description");
	const [pointLat, SetPointLat] = useState("");
	const [pointLng, SetPointLng] = useState("");
	const [showModal, setShowModal] = useState(false);

	async function handlesubmit(event) {
		event.preventDefault();
		let data = {
			locationType: LocationType.HUT,
			description: descriptions,
			point: [pointLng, pointLat],
		};

		console.log(data);
		const hut = await createLocation(data);
		if (hut) {
			console.log("Hut created");
			navigate("/huts");
		}
	}

	return (
		<Form onSubmit={handlesubmit}>
			<Row>
				<Col xs={12} md={6}>
					<Form.Group controlId="lat" className="mt-3">
						<Form.Label>Latitude Point</Form.Label>
						<Form.Control
							type="number"
							name="Latitude"
							value={pointLat}
							onChange={(event) => {
								SetPointLat(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col xs={12} md={6}>
					<Form.Group controlId="lng" className="mt-3">
						<Form.Label>Longitude Point</Form.Label>
						<Form.Control
							type="number"
							name="Longitude"
							value={pointLng}
							onChange={(event) => {
								SetPointLng(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col xs={12} md={12}>
					<Form.Group controlId="description" className="mt-3">
						<Form.Label>Description</Form.Label>
						<Form.Control
							type="text"
							name="Description"
							value={descriptions}
							onChange={(event) => {
								setdescriptions(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Stack direction="horizontal" className="mt-4" gap={3}>
				<Button variant="success" type="submit">
					Create
				</Button>
				<Button variant="outline-success" onClick={() => setShowModal(true)}>
					Select from map
				</Button>
			</Stack>
			<PositionSelectorModal
				show={showModal}
				setShow={setShowModal}
				onCancel={() => setShowModal(false)}
				onOk={(coordinates) => {
					SetPointLat(coordinates[0]);
					SetPointLng(coordinates[1]);
					setShowModal(false);
				}}
			/>
		</Form>
	);
}

export default DescribeHutForm;
