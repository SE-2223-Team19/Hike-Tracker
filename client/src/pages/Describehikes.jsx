import React from "react";

import Table from 'react-bootstrap/Table';
import {Container,Row,Button} from 'react-bootstrap'

function Describe() {
  return (
    
    
    <Container>
    
    <Row>

      <Table>
        <thead>
          <tr>
            <td>Describehikes</td>
          </tr>
        </thead>
      </Table>

    </Row>
    <Row>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>title</th>
          <th>length</th>
          <th>ascent</th>
          <th>expectedTime</th>
          <th>difficulty</th>
          <th>description</th>
          <th>startPoint</th>
          <th>endPoint</th>
          <th>referencePoints</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>test</td>
          <td> <ActionButtons/></td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>test</td>
          <td> <ActionButtons/></td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>test</td>
          <td> <ActionButtons/></td>
        </tr>
        
        

      </tbody>
    </Table>
    </Row>
    </Container>
    
  );
}

function ActionButtons() {
  return (
    <>
      
      <Button className="rounded-circle" variant="outline-warning">Edit</Button>{' '}
      <Button className="rounded-circle"  variant="outline-danger" onClick={()=>{}}>Delete</Button>{' '}
      <Button className="rounded-circle" variant="outline-success">Add</Button>{' '}
      
    </>
  );
}


export default Describe;