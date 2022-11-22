import {Form,Button,Row,Col} from "react-bootstrap"

import Table from 'react-bootstrap/Table';

function DefineReferenceTable() {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>Location Type</th>
          <th>Latitude Point</th>
          <th>Longitude Point</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
     
      </tbody>
    </Table>
  );
}




function DefineReferenceForm(){
    return(
        
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Location Type</Form.Label>
        
          <Form.Select>
          <option></option>  
          <option>hut</option>
          <option>parking_lot</option>
          <option>default</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Latitude Point</Form.Label>
          <Form.Control type="text" placeholder="Insert Latitude" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Longitude Point</Form.Label>
          <Form.Control type="text" placeholder="Insert Longitude" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3}  placeholder="Describe Your status"/>
      </Form.Group>
        <Button variant="success" size="lg">
        Set Point
      </Button>
      <Button variant="light" size="lg">
        Cancel
      </Button>
      </Form>
    )
}


const Reference={DefineReferenceForm, DefineReferenceTable}
export default Reference