import { React, useState } from "react";
import { Button, Container, Modal, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, useMapEvent, Marker } from "react-leaflet";

const PositionSelectorModal = ({ onCancel, onOk, show, setShow }) => {
	const [coordinates, setCoordinates] = useState(null);
	const MapEvents = () => {
		useMapEvent("click", (e) => {
			setCoordinates([e.latlng.lat, e.latlng.lng]);
		});
	};

	const onHide = () => setShow(false);

	return (
		<Modal show={show} onHide={onHide} size={"lg"}>
			<Modal.Header closeButton>
				<Modal.Title>Select point</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Container>
					<Row>
						<Col>
							<MapContainer
								style={{ width: "100%", height: "60vh" }}
								center={coordinates || [45.06837, 7.68307]}
								zoom={7}
								scrollWheelZoom={false}
							>
								<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
								{coordinates && <Marker position={coordinates}></Marker>}
								<MapEvents />
							</MapContainer>
						</Col>
					</Row>
				</Container>
			</Modal.Body>

			<Modal.Footer>
				<Button onClick={onCancel} variant={"secondary"}>
					Cancel
				</Button>
				<Button
					onClick={() => {
						onOk(coordinates);
					}}
					variant={"success"}
				>
					Ok
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default PositionSelectorModal;
