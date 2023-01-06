import { React, useState, useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Popup } from "react-leaflet";
import * as L from "leaflet";
import { Button, Row, Col } from "react-bootstrap";

function SelectPointMap({ regHike, trackPoints, setPoint }) {
    const [map, setMap] = useState(null);
    
    function checkEquals(point, idx) {
        for(let i = 0; i < regHike.recordedPoints.length; i++) {
            const currPoint = [...regHike.recordedPoints[i]].reverse()
            if(currPoint[0] == point[0] && currPoint[1] == point[1]) {
                return true
            }  
        }
        return false
    }

	const markerStartEndPoint = new L.icon({
		iconUrl: require("../icons/marker_start_end_point.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

    const handleButton = (point, index) => {
        setPoint({point: point, index: index+1})
        map.closePopup();
    }

    useEffect(() => {
        const bounds = [
            trackPoints && trackPoints.length > 0 && trackPoints.reduce(([lat, lng], [maxLat, maxLng]) => [Math.max(lat, maxLat), Math.max(lng, maxLng)]),
            trackPoints && trackPoints.length > 0 && trackPoints.reduce(([lat, lng], [minLat, minLng]) => [Math.min(lat, minLat), Math.min(lng, minLng)])
        ];
        if (map !== null)
            map.fitBounds(bounds);
    }, [map, trackPoints])


	return (
        trackPoints && trackPoints.length > 0 && 
            <MapContainer
                ref={setMap}
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={false}
                zoomControl={true}
                dragging={true}
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
                    regHike.hike.referencePoints && 
                    regHike.hike.referencePoints.map((point, index) => (
                        <Marker key={`ref-point-${index}`} position={point}>
                            <Popup >
                                <Row>
                                    <Col>Reference Point N°. {index + 1}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {!checkEquals(point, index + 1) ? <Button variant="danger" size="sm" onClick={() => handleButton(point, index)}>
                                            Add as Arrived Point
                                        </Button> : <></>}
                                    </Col>
                                </Row>
                            </Popup>
                        </Marker>
                    ))
                }
                <Polyline
                    pathOptions={{ fillColor: "red", color: "blue" }}
                    positions={trackPoints}
                />
            </MapContainer>
	);
}

export default SelectPointMap;