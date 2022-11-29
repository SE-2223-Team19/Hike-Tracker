import { React } from "react";
import { Button, Modal } from "react-bootstrap";
import { MapContainer, Marker, Polyline, TileLayer, Popup } from "react-leaflet";
import * as L from "leaflet";

function ModalMap({ handleClose, hike }) {
	const markerStartEndPoint = new L.icon({
		iconUrl: require("../icons/marker_start_end_point.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	const markerLocation = new L.icon({
		iconUrl: require("../icons/markerLocation.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	const bounds = [
		hike && hike.trackPoints.reduce(([lat, lng], [maxLat, maxLng]) => [Math.max(lat, maxLat), Math.max(lng, maxLng)]),
		hike && hike.trackPoints.reduce(([lat, lng], [minLat, minLng]) => [Math.min(lat, minLat), Math.min(lng, minLng)])
	];

	return (
		<Modal show={hike} onHide={handleClose}>
			<Modal.Header>
				<Modal.Title>{hike && hike.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<MapContainer
					style={{ width: "100%", height: "50vh" }}
					scrollWheelZoom={false}
					zoomControl={true}
					dragging={true}
					bounds={bounds}
				>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					{
						hike && hike.startPoint &&
						<Marker
							key={"start"}
							position={[...hike.startPoint.point].reverse()}
							icon={markerStartEndPoint}
						>
							<Popup>Start Point</Popup>
						</Marker>
					}
					{
						hike && hike.endPoint &&
						<Marker
							key={"end"}
							position={[...hike.endPoint.point].reverse()}
							icon={markerStartEndPoint}
						>
							<Popup>End Point</Popup>
						</Marker>
					}
					{
						hike && 
						hike.referencePoints.map((point, index) => (
							<Marker key={`ref-point-${index}`} position={point}>
								<Popup>Reference Point N°. {index + 1}</Popup>
							</Marker>
						))
					}
					{
						hike && 
						hike.linkedHuts.map((point) => (
							<Marker key={point._id} position={[...point.point].reverse()} icon={markerLocation}>
								<Popup>{point.description}</Popup>
							</Marker>
						))
					}
					{
						hike &&
						<Polyline
							pathOptions={{ fillColor: "red", color: "blue" }}
							positions={hike.trackPoints}
						/>
					}
				</MapContainer>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalMap;
