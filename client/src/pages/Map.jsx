import { useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

function Map(props) {
	// Coordinates of Turin
	const [position, setPosition] = useState([45.06837, 7.68307]);
	navigator.geolocation.getCurrentPosition((e) =>
		setPosition([e.coords.latitude, e.coords.longitude])
	);

	// const MapEvents = () => {
	//   useMapEvents({
	//     click(e) {
	//       console.log(e.latlng.lat);
	//       console.log(e.latlng.lng);
	//       setPosition(() => [e.latlng.lat, e.latlng.lng])
	//     },
	//   });
	//   return false;
	// }

	//let p = navigator.geolocation.getCurrentPosition((e) => console.log(e.coords))

	return (
		<MapContainer
			style={{ width: "100%", height: "100vh" }}
			center={position}
			zoom={13}
			scrollWheelZoom={false}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker position={position}>
				<Popup>
					You are in position with latitude: {position[0].toFixed(3)} and longitude:{" "}
					{position[1].toFixed(3)}
				</Popup>
			</Marker>
			{/* <MapEvents/> */}
		</MapContainer>
	);
}

export default Map;
