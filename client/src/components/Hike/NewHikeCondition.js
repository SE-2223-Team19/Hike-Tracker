import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { HikeCondition } from '../../helper/enums';
import {updateHike} from '../../api/hikes';

function NewHikeCondition({ hike, setDirty }) {

    const [show, setShow] = useState(false);
    const [description, setDescription] = useState("");
    const [condition, setCondition] = useState("");


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleSubmit = async (event)=>{
        event.preventDefault();

        const changes = {
          description: description,
          hikeCondition: condition
        }
        console.log(hike._id);
        await updateHike(hike._id,{...changes})

        console.log(description);
        setDescription("")
        handleClose();
        setDirty(true);
    };

 

  return (
    <>
      <Button  variant="warning" onClick={handleShow}>
        Hike Condition
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hike Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Hut Status:</Form.Label>

              <Form.Select value={condition} onChange={(ev) => setCondition(ev.target.value)}>
                  <option value=""></option>
                  {
                      Object.values(HikeCondition)
                      .map((e) => (
                      <option key={e} value={e}>
                          {e}
                      </option>
                      ))
                  }
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={description} rows={3} onChange={(ev)=>{setDescription(ev.target.value)}}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default NewHikeCondition;
