import { React } from "react";
import { Button, Container, Modal, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

const PositionPreferenceModal = ({ coordinates, radius, show, setShow }) => {
    const onHide = () => setShow(false);

    return (
        <Modal show={show} onHide={onHide} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>Selected area</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row>
                        <Col>
                            <MapContainer style={{ width: "100%", height: "60vh" }} center={coordinates} zoom={7} scrollWheelZoom={false}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Circle center={coordinates}
                                    radius={radius}></Circle>
                            </MapContainer>
                        </Col>
                    </Row>

                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide} variant={"secondary"}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PositionPreferenceModal;
