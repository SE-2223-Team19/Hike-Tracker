import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Hut_Condition } from '../helper/enums';

function NewHikeCondition(props) {
  const [show, setShow] = useState(false);

  const [DescriptionBox, setDescriptionBox] = useState();
  const [Hutconidtion, setHutcondition] = useState();


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handlesubmit=()=>{
console.log(props.hike._id);
handleClose();
    
  }

  return (
    <>
      <Button  variant="warning" onClick={handleShow}>
        HiKe Condition
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hike Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Hut:</Form.Label>
            
            <Form.Select aria-label="Default select example">
             <option>Choose Hut Number</option>
             <option value="1">One</option>
             <option value="2">Two</option>
             <option value="3">Three</option>
             <option value="4">Four</option>

             </Form.Select>
             
             <Form.Label>Hut Status:</Form.Label>
            {/* <Form.Select aria-label="Default select example">
             <option>select</option>
             <option value="open">Open</option>
             <option value="overloaded">Over loaded</option>
             <option value="close_BadWeather">closed_BadWeather</option>
             <option value="close_maintenance">closed_Maintenance</option>
             </Form.Select> */}

          <Form.Select value={Hutconidtion} onChange={(ev) => setHutcondition(ev.target.value)}>
					<option>select</option>
          {Object.values(Hut_Condition).map((e) => (
						<option key={e} value={e}>
							{e}
						</option>
					))}
			  	</Form.Select>
          
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} onChange={(ev)=>{setDescriptionBox(ev.target.value)}}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlesubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export {NewHikeCondition} 
// render(<HikeCondition />);
