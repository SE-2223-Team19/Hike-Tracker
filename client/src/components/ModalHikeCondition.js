import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Hut_Condition } from '../helper/enums';
import {updateHike} from '../api/hikes'
function NewHikeCondition(props) {
  const [show, setShow] = useState(false);

  const [DescriptionBox, setDescriptionBox] = useState();
  const [Hutconidtion, setHutcondition] = useState();
  const [HutNumber, setHutNumber] = useState();


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handlesubmit=async (event)=>{
    event.preventDefault();
    
   const changes ={
    description: DescriptionBox,
    hikeCondition: Hutconidtion
   }
   console.log(props.hike._id);
   await updateHike(props.hike._id,{...changes})
   
   console.log(DescriptionBox);
   setDescriptionBox("")
   handleClose();
   window.location.reload();
    
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
              <Form.Control as="textarea" value={DescriptionBox} rows={3} onChange={(ev)=>{setDescriptionBox(ev.target.value)}}/>
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
