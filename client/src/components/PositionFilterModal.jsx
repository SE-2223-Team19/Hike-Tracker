import { React, useState } from "react";
import { Button, Container, Form, Modal, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, useMapEvent, Circle } from 'react-leaflet';

const PositionFilterModal = ({ onCancel, onOk, show, setShow }) => {
	const [ coordinates, setCoordinates ] = useState([45.068370, 7.683070]);
    const [ radius, setRadius ] = useState(50); // Radius in meters
    const MapEvents = () => {
        useMapEvent("click", (e) => {
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
                <Container>
                    <Row>
                        <Col>
                            <MapContainer style={{ width: "100%", height: "60vh" }} center={[45.068370, 7.683070]} zoom={7} scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Circle center={coordinates} 
                                        radius={radius * 1000}></Circle>
                                <MapEvents/>
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
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onCancel} variant={"secondary"}>Cancel</Button>
                <Button onClick={() => {
                    onOk(coordinates, radius);
                }} variant={"success"}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PositionFilterModal;
