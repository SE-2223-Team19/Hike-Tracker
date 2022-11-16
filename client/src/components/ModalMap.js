import { Button, Modal } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

function ModalMap({handleClose, hike}) {
	
    if (hike) {
        // Only for test purposes
        hike.routePoints = hike.routePoints || [
            [40.689818841705, -74.04511194542516],
            [40.75853187779803, -73.98495720388513],
            [40.86151538060051, -74.06201170384256],
            [40.80981015620906, -74.03656769139772],
            [40.80721155324825, -74.04274750092904],
            [40.78901848327006, -74.081199649124],
            [40.764319913561216, -74.08840942691056],
            [40.749756455072884, -74.09493255919364],
            [40.74793579843903, -74.07673645335137],
            [40.675849802727335, -74.19758606169779],
            [40.60394644123212, -74.05991363796608],
            [40.6495463256113, -73.96000671720954],
        ];
    }

    return (<Modal show={hike} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>Hike: {hike && hike.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <MapContainer style={{ width: "100%", height: "50vh" }} center={(hike && hike.routePoints[0]) || [0, 0]} zoom={9} scrollWheelZoom={false} zoomControl = {false} dragging = {false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Polyline
                    pathOptions={{fillColor: 'red', color: 'blue'}}
                    positions = {(hike && hike.routePoints) || []}
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

export default ModalMap