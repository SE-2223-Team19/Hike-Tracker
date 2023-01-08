import React from "react";
import { Col } from "react-bootstrap";
import { Popup } from "react-leaflet";
import { Marker } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import * as L from "leaflet";
import { TileLayer } from "react-leaflet";

function ParkingLotMap({ parkinglot }) {
	let markerLocation = new L.icon({
		iconUrl: require("../../icons/markerLocation.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	return (
		<Col xs={12}>
			<MapContainer
				style={{ width: "100%", height: "100px" }}
				center={parkinglot ? [...parkinglot.point].reverse() : [0, 0]}
				zoom={7}
				scrollWheelZoom={false}
				zoomControl={false}
				dragging={false}
			>
				<Marker position={[...parkinglot.point].reverse()} icon={markerLocation}>
					<Popup>Reference point</Popup>
				</Marker>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			</MapContainer>
		</Col>
	);
}

export default ParkingLotMap;
