import { Badge, Button, Card, Col, Container, Row, Stack, Modal } from "react-bootstrap";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

function ModalMap(props) {

    const show = props.show
    const handleClose = props.handleClose
    

    return <Modal show={show} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>Hike: {props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <MapContainer style={{ width: "100%", height: "50vh" }} center={props.positions[0]} zoom={9} scrollWheelZoom={false} zoomControl = {false} dragging = {false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Polyline
                    pathOptions={{fillColor: 'red', color: 'blue'}}
                    positions = {props.positions}
                />
            </MapContainer>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
}

export default ModalMap