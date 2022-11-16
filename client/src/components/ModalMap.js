import { Button, Modal } from "react-bootstrap";
import { MapContainer, Marker, Polyline, TileLayer, Popup } from "react-leaflet";

function ModalMap({handleClose, hike}) {
    return (<Modal show={hike} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>Hike: {hike && hike.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <MapContainer style={{ width: "100%", height: "50vh" }} center={(hike && hike.trackPoints[0]) || [0, 0]} zoom={9} scrollWheelZoom={false} zoomControl = {true} dragging = {true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {
                    hike && 
                    <Marker key={"start"} position={[...hike.startPoint.point].reverse()}>
                        <Popup>Start Point</Popup>
                    </Marker>
                }
                {
                    hike && hike.referencePoints.map(point => <Marker key={point._id} position={[...point.point].reverse()}><Popup>Reference point</Popup></Marker>)
                }
                { 
                    hike &&
                    <Marker key={"end"} position={[...hike.endPoint.point].reverse()}>
                        <Popup>End Point</Popup>
                    </Marker>
                }
                <Polyline
                    pathOptions={{fillColor: 'red', color: 'blue'}}
                    positions = {(hike && hike.trackPoints) || []}
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