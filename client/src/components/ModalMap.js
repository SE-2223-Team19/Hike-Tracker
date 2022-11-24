import { Button, Modal } from "react-bootstrap";
import { MapContainer, Marker, Polyline, TileLayer, Popup, useMap as usemap, useLeafnet } from "react-leaflet";
import * as L from "leaflet";
import { useRef } from "react";

function ModalMap({ handleClose, hike }) {

    let markerStartEndPoint = new L.icon({
        iconUrl: require("../icons/marker_start_end_point.png"),
        iconSize: [35, 45],
        iconAnchor: [17, 46],
        popupAnchor: [0, -46],
    })

    let markerLocation = new L.icon({
        iconUrl: require("../icons/markerLocation.png"),
        iconSize: [35, 45],
        iconAnchor: [17, 46],
        popupAnchor: [0, -46],
    })

    return (<Modal show={hike} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>Hike: {hike && hike.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <MapContainer style={{ width: "100%", height: "50vh" }} center={(hike && hike.trackPoints[0]) || [0, 0]} zoom={9} scrollWheelZoom={false} zoomControl={true} dragging={true} setView={(hike && hike.trackPoints[0]) || [0, 0]} >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker key={"start"} position={(hike && hike.startPoint.reverse()) || [0, 0]} icon={markerStartEndPoint} >
                    <Popup>Start Point</Popup>
                </Marker>
                <Marker key={"end"} position={(hike && hike.endPoint.reverse()) || [0, 0]} icon={markerStartEndPoint}>
                    <Popup>End Point</Popup>
                </Marker>
                {hike ? hike.referencePoints.map(point => <Marker key={point._id} position={[...point.point].reverse()} icon={markerLocation}><Popup>Reference point</Popup></Marker>) : <></>}
                <Polyline
                    pathOptions={{ fillColor: 'red', color: 'blue' }}
                    positions={(hike && hike.trackPoints) || []}
                />
            </MapContainer>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>);
}


export default ModalMap;
