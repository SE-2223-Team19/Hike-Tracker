import { useState, useEffect } from "react";
import { Form, ButtonGroup, Button } from "react-bootstrap";
import { updateHike } from "../api/hikes";
import { LocationType } from "../helper/enums";
import { getLocations } from "../api/locations";
import PositionSelectorModal from "./PositionSelectorModal";
import { useNavigate } from "react-router-dom";

function NewReferencePoint({ addReferencePoint }) {
	const navigate = useNavigate();

	const [locationType, setLocationType] = useState("hut");
	const [latitudePoint, setLatitudePoint] = useState(1);
	const [longitudePoint, setLongitudePoint] = useState(1);
	const [description, setDescription] = useState("");
	const [showModal, setShowModal] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const location = {
			locationType: locationType,
			description: description,
			point: { lat: latitudePoint, lng: longitudePoint },
		};
		const updatedHike = await addReferencePoint(location);
		if (updatedHike) {
			navigate(`/profile`);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>Location Type</Form.Label>
				<Form.Select value={locationType} onChange={(ev) => setLocationType(ev.target.value)}>
					{Object.values(LocationType).map((e) => (
						<option key={e} value={e}>
							{e}
						</option>
					))}
				</Form.Select>
			</Form.Group>
			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Latitude Point</Form.Label>
				<Form.Control
					type={"number"}
					value={latitudePoint}
					onChange={(ev) => setLatitudePoint(ev.target.value)}
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Longitude Point</Form.Label>
				<Form.Control
					type={"number"}
					value={longitudePoint}
					onChange={(ev) => setLongitudePoint(ev.target.value)}
				/>
			</Form.Group>
			<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
				<Form.Label>Description</Form.Label>
				<Form.Control
					as="textarea"
					rows={3}
					required
					placeholder="Describe Your status"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</Form.Group>
			<Button type="submit" size="lg" variant="success">
				Create and add
			</Button>
			<Button
				type="button"
				size="lg"
				variant="secondary"
				className="ms-3"
				onClick={() => setShowModal(true)}
			>
				Select location on map
			</Button>
			<PositionSelectorModal
				show={showModal}
				setShow={setShowModal}
				onCancel={() => setShowModal(false)}
				onOk={(coordinates) => {
					setLatitudePoint(coordinates[0]);
					setLongitudePoint(coordinates[1]);
					setShowModal(false);
				}}
			/>
		</Form>
	);
}

function FromList({ addReferencePoint }) {
	const navigate = useNavigate();

	const [locations, setLocation] = useState([]);
	const [locationToAdd, setLocationToAdd] = useState([]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const updatedHike = await addReferencePoint(locationToAdd);
		if (updatedHike) {
			navigate(`/profile`);
		}
	};

	useEffect(() => {
		const fetchLocation = async () => {
			const locations = await getLocations();
			setLocation(locations);
		};
		fetchLocation();
	}, []);

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3">
				<Form.Label>Choose reference point</Form.Label>
				<Form.Select onChange={(e) => setLocationToAdd(e.target.value)}>
					{locations.map((l) => (
						<option value={l._id} key={l._id}>
							[{l.locationType}] {l.description}
						</option>
					))}
				</Form.Select>
			</Form.Group>
			<Button type="submit" size="lg" variant="success">
				Add
			</Button>
		</Form>
	);
}

function DefineReferenceForm({ hikeId }) {
	const [reference, setReference] = useState(0);

	const addReferencePoint = async (location) => {
		const updatedHike = await updateHike(hikeId, { referencePoints: [location] });
		return updatedHike;
	};

	return (
		<>
			<ButtonGroup className="mb-3 w-100">
				<Button
					onClick={() => setReference(0)}
					variant={reference === 0 ? "success" : "outline-success"}
				>
					Add from existing
				</Button>
				<Button
					onClick={() => setReference(1)}
					variant={reference === 1 ? "success" : "outline-success"}
				>
					Create and add
				</Button>
			</ButtonGroup>
			{reference === 0 && <FromList addReferencePoint={addReferencePoint} />}
			{reference === 1 && <NewReferencePoint addReferencePoint={addReferencePoint} />}
		</>
	);
}

export default DefineReferenceForm;
