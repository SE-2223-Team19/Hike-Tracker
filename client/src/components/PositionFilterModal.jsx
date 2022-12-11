import { React, useState } from "react";
import { Button, Container, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, useMapEvent, Circle } from 'react-leaflet';
import { getLatLongFromCity } from "../helper/utils";

const PositionFilterModal = ({ onCancel, onOk, onRemoveFilter, show, setShow }) => {
    const [coordinates, setCoordinates] = useState([45.068370, 7.683070]);
    const [radius, setRadius] = useState(50); // Radius in meters

    const [city, setCity] = useState("Torino")
    const [ref, setRef] = useState(undefined)
    const [error, setError] = useState("")

    async function loadAddress() {
        try {
            const address = await getLatLongFromCity(city ? city : "Torino")
            setCoordinates([address[0].lat, address[0].lon])
            if (ref)
                ref.flyTo([address[0].lat, address[0].lon])
        } catch (err) {
            setError("City does not found")
        }
    }

    const MapEvents = () => {
        useMapEvent("click", async (e) => {
            setCoordinates([e.latlng.lat, e.latlng.lng]);
        });

    };

    const onHide = () => setShow(false);

    return (
        <Modal show={show} onHide={onHide} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>Select area</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
                <Container>
                    <Row>
                        <Col>
                            <MapContainer ref={setRef} style={{ width: "100%", height: "60vh" }} center={coordinates} zoom={7} scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Circle center={coordinates}
                                    radius={radius * 1000}></Circle>
                                <MapEvents />
                            </MapContainer>
                        </Col>
                    </Row>
                    <Row className={"mt-2"}>
                        <Col>
                            <Form.Group>
                                <Form.Label>Distance</Form.Label>
                                <Form.Range value={radius} onChange={(e) => setRadius(parseInt(e.target.value))} step={1} min={1} max={100}></Form.Range>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control onChange={(ev) => { setCity(ev.target.value) }} />
                            </Form.Group>
                        </Col>
                        <Col><Button variant="success" onClick={async () => await loadAddress()}>Search</Button></Col>
                    </Row>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onRemoveFilter} variant={"danger"}>Remove</Button>
                <Button onClick={onCancel} variant={"secondary"}>Cancel</Button>
                <Button
                    data-test-id="position-ok-button"
                    onClick={() => {
                        onOk(coordinates, radius);
                    }} variant={"success"}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PositionFilterModal;
