import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import * as L from "leaflet";

function HutMap({ hut, height = 100, zoom = 7 }) {
	let markerLocation = new L.icon({
		iconUrl: require("../../icons/markerLocation.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	let points = [...hut.point].reverse().reduce((e1, e2) => {
		return "Lat: " + e1.toFixed(2) + ", Lon: " + e2.toFixed(2);
	});

	return (
		<>
			<MapContainer
				style={{ width: "100%", height }}
				center={hut ? [...hut.point].reverse() : [0, 0]}
				zoom={zoom}
				scrollWheelZoom={false}
				zoomControl={false}
				dragging={false}
				doubleClickZoom={false}
			>
				<Marker position={[...hut.point].reverse()} icon={markerLocation}>
					<Popup>{points}</Popup>
				</Marker>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			</MapContainer>
		</>
	);
}

export default HutMap;
