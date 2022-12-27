import { React, useState } from "react";
import { Button, Container, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import { MapContainer, TileLayer, useMapEvent, Circle } from 'react-leaflet';
import { getLatLongFromCity } from "../../helper/utils";
//import { WeatherCondition } from "../../helper/enums ";
import {WeatherCondition} from '../../helper/enums'



const WeatherAlert = ({ onCancel, onOk, onRemoveFilter }) => {
    const [coordinates, setCoordinates] = useState([45.068370, 7.683070]);
    const [radius, setRadius] = useState(50); // Radius in meters
    console.log(radius);
    console.log(coordinates);
    const [city, setCity] = useState("Torino")
    const [ref, setRef] = useState(undefined)
    const [error, setError] = useState("")
    const [show,setshow] = useState()
    const [weather,setweather] = useState("")
    //console.log(city);
    //console.log(ref);
    const handlesubmit = async (event)=>{
        event.preventDefault()
        const changes = {
            weatherCondition: weather,
            selectedZone: radius,
            radius : radius,
            coordinates : coordinates


        }
    }

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

    const onHide = () => setshow(false);
   // const handleClose = () => setshow(false);
    const handleShow = () => setshow(true);

    return (
        <>
        <Button variant="primary" onClick={handleShow}>
        Set Weather Alert
       </Button>
        <Modal show={show} onHide={onHide} size={"lg"}>
            <Modal.Header closeButton>
                <Modal.Title>Weather Alert</Modal.Title>
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
                 
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              
                            <Form.Select value={weather} onChange={(ev)=>setweather(ev.target.value)}>
                             <option value=""></option>
                                 {
                                     Object.values(WeatherCondition)
                                     .map((x) => (
                                     <option key={x} value={x}>
                                         {x}
                                     </option>
                                     ))
                                 }
                              
                              </Form.Select> 
                           </Form.Group>
                     
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
        </>
    );
};

export default WeatherAlert;







//import React, { useState } from 'react';




// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Modal from 'react-bootstrap/Modal';
// import {WeatherCondition} from '../../helper/enums'
// import loadAddress from '../PositionFilterModal'
// import { useEffect } from 'react';

// function WeatherAlert() {
//   const [show, setShow] = useState(false);
//   const [weather,setweather] = useState("")


//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow}>
//         Set Weather Alert
//       </Button>
      
      
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Weather Alert</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Button variant="primary" onClick={async()=>await loadAddress()}>
//               Set Weather Alert
//             </Button>
      
          
//             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              
//               <Form.Select value={weather} onChange={(ev)=>setweather(ev.target.value)}>
//               <option value=""></option>
//                   {
//                       Object.values(WeatherCondition)
//                       .map((x) => (
//                       <option key={x} value={x}>
//                           {x}
//                       </option>
//                       ))
//                   }
                
//                </Form.Select> 
//             </Form.Group>
            
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default WeatherAlert