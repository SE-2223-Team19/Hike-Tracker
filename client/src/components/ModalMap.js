import { Button, Modal } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

function ModalMap({ handleClose, hike }) {
	return (
		<Modal show={hike} onHide={() => handleClose(null)}>
			<Modal.Header>
				<Modal.Title>Hike: {hike && hike.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<MapContainer
					style={{ width: "100%", height: "50vh" }}
					center={(hike && hike.trackPoints[0]) || [0, 0]}
					zoom={9}
					scrollWheelZoom={false}
					zoomControl={false}
					dragging={false}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<Polyline
						pathOptions={{ fillColor: "red", color: "blue" }}
						positions={(hike && hike.trackPoints) || []}
					/>
				</MapContainer>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => handleClose(null)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalMap;
