import { React } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Popup } from "react-leaflet";
import * as L from "leaflet";
import { Button, Row, Col } from "react-bootstrap";

function SelectReferencePointsMap({ trackPoints, referencePoints, setReferencePoints }) {
	const markerStartEndPoint = new L.icon({
		iconUrl: require("../icons/marker_start_end_point.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	const bounds = [
		trackPoints && trackPoints.length > 0 && trackPoints.reduce(([lat, lng], [maxLat, maxLng]) => [Math.max(lat, maxLat), Math.max(lng, maxLng)]),
		trackPoints && trackPoints.length > 0 && trackPoints.reduce(([lat, lng], [minLat, minLng]) => [Math.min(lat, minLat), Math.min(lng, minLng)])
	];

	return (
        trackPoints && trackPoints.length > 0 && 
            <MapContainer
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={false}
                zoomControl={true}
                dragging={true}
                bounds={bounds}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                    key={"start"}
                    position={trackPoints[0]}
                    icon={markerStartEndPoint}
                >
                    <Popup>Start Point</Popup>
                </Marker><Marker
                    key={"end"}
                    position={trackPoints[trackPoints.length - 1]}
                    icon={markerStartEndPoint}
                >
                    <Popup>End Point</Popup>
                </Marker>
                {
                    referencePoints && 
                    referencePoints.map((point, index) => (
                        <Marker key={`ref-point-${index}`} position={point}>
                            <Popup>
                                <Row>
                                    <Col>Reference Point N°. {index + 1}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="danger" size="sm" onClick={() => {
									        setReferencePoints(referencePoints.filter(p => p[0] !== point[0] && p[1] !== point[1]));
                                        }}>
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            </Popup>
                        </Marker>
                    ))
                }
                <Polyline
                    pathOptions={{ fillColor: "red", color: "blue" }}
                    eventHandlers={{
                        click(e) {
                            setReferencePoints([...referencePoints, [e.latlng.lat, e.latlng.lng]]);
                        }
                    }}
                    positions={trackPoints}
                />
            </MapContainer>
	);
}

export default SelectReferencePointsMap;