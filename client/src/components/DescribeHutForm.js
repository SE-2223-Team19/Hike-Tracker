import { createLocation } from "../api/locations";
import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { LocationType } from "../helper/enums";
import PositionSelectorModal from "./PositionSelectorModal";
import { useNavigate } from "react-router-dom";

function DescribeHutForm() {
	const navigate = useNavigate();

	const [description, setDescription] = useState("");
	const [altitude, setAltitude] = useState(0);
	const [pointLat, SetPointLat] = useState("");
	const [pointLng, SetPointLng] = useState("");
	const [name, setName] = useState("");
	const [numberOfBeds, setNumberOfBeds] = useState(0);
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [webSite, setWebSite] = useState("");

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		async function getAltitude() {
			const url = new URL("https://api.open-elevation.com/api/v1/lookup");
			url.searchParams.append("locations", `${pointLat},${pointLng}`);
			const res = await fetch(url);
			if (res.ok) {
				const body = await res.json();
				if (body.results && body.results.length === 1) {
					setAltitude(body.results[0].elevation);
				}
			}
		}
		getAltitude();
	}, [pointLat, pointLng]);

	async function handlesubmit(event) {
		event.preventDefault();
		let data = {
			locationType: LocationType.HUT,
			description: description,
			point: [pointLng, pointLat],
			name: name,
			altitude: altitude,
			numberOfBeds: numberOfBeds,
			email: email,
			phone: phone,
			webSite: webSite
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
				<Col xs={12} md={4}>
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
				<Col xs={12} md={4}>
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
				<Col xs={12} md={4}>
					<Form.Group controlId="lng" className="mt-3">
						<Form.Label>Altitude (m.a.s.l.)</Form.Label>
						<Form.Control
							type="number"
							name="Altitude"
							value={altitude}
							onChange={(event) => {
								setAltitude(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid">Invalid value</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col xs={12} md={12}>
					<Form.Group controlId="name" className="mt-3">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							name="Name"
							value={name}
							placeholder="Hut Name"
							onChange={(event) => {
								setName(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
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
							value={description}
							placeholder="Hut Description"
							onChange={(event) => {
								setDescription(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group className="mt-3">
						<Form.Label>Number of beds</Form.Label>
						<Form.Control
							type="number"
							name="Number of beds"
							value={numberOfBeds}
							onChange={(event) => {
								setNumberOfBeds(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group className="mt-3">
						<Form.Label>Phone</Form.Label>
						<Form.Control
							type="tel"
							name="Number of beds"
							value={phone}
							onChange={(event) => {
								setPhone(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group className="mt-3">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							name="Email"
							value={email}
							onChange={(event) => {
								setEmail(event.target.value);
							}}
						/>
						<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group className="mt-3">
						<Form.Label>Web site</Form.Label>
						<Form.Control
							type="url"
							name="Web Site"
							value={webSite}
							onChange={(event) => {
								setWebSite(event.target.value);
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
