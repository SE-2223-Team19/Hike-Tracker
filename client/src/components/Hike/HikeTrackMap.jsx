import React from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import * as L from "leaflet";

const HikeTrackMap = ({ hike }) => {
	const markerStartEndPoint = new L.icon({
		iconUrl: require("../../icons/marker_start_end_point.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	const markerLocation = new L.icon({
		iconUrl: require("../../icons/markerLocation.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	const bounds = [
		hike &&
			hike.trackPoints.reduce(([lat, lng], [maxLat, maxLng]) => [
				Math.max(lat, maxLat),
				Math.max(lng, maxLng),
			]),
		hike &&
			hike.trackPoints.reduce(([lat, lng], [minLat, minLng]) => [
				Math.min(lat, minLat),
				Math.min(lng, minLng),
			]),
	];

	return (
		<MapContainer
			style={{ width: "100%", height: "50vh" }}
			center={(hike && hike.trackPoints[0]) || [0, 0]}
			scrollWheelZoom={false}
			zoomControl={true}
			dragging={true}
			bounds={bounds}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			{
				hike &&
				<Marker
					key={"start"}
					position={(hike.startPoint && [...hike.startPoint.point].reverse()) || hike.trackPoints[0]}
					icon={markerStartEndPoint}
				>
					<Popup>Start Point</Popup>
				</Marker>
			}
			{
				hike &&
				<Marker
					key={"end"}
					position={(hike.endPoint && [...hike.endPoint.point].reverse()) || hike.trackPoints[hike.trackPoints.length - 1]}
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
	);
};

export default HikeTrackMap;
