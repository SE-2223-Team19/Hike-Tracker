import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {WeatherCondition} from '../../helper/enums'
import loadAddress from '../PositionFilterModal'
import { useEffect } from 'react';

function WeatherAlert() {
  const [show, setShow] = useState(false);
  const [weather,setweather] = useState("")

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Set Weather Alert
      </Button>
      
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Weather Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Button variant="primary" onClick={async()=>await loadAddress()}>
              Set Weather Alert
            </Button>
      
          
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
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default WeatherAlert