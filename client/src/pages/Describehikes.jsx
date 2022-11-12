import React from "react";

import Table from 'react-bootstrap/Table';
import {Container,Row,Button, Form} from 'react-bootstrap'
import { useState } from "react";
import AddForm from "../Components/DescriptionFrom";
import DescriptionRow from "../Components/DescriptionRow"

function DescribeTable(props) {
 
  const [Loginstatus,setLoginstatus]=useState(true);
  const [Formstatus,setFormstatus]=useState(false);
  console.log(Formstatus);
  //const ToggleLogin =()=>{setLoginstatus(false)};
  const LoginControl=()=> {

        return <p>{Loginstatus ? <Button onClick={()=>{setLoginstatus(false)}}>Logout</Button> :<Button onClick={()=>{setLoginstatus((X)=>(!X))}}>Login</Button>}</p> ;

};


  return <>
    
    
    <Container>
    <LoginControl Loginstatus={Loginstatus} />
    
    
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
    <Button variant="outline-success" onClick={()=>{setFormstatus(true)}}>Add</Button>{' '}
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
          {Loginstatus&&<th>Action</th>}
        </tr>
      </thead>
      <tbody>
      {
           props.Description.map((Description) => (<DescriptionRow key={Description.id} Description={Description} />))
      }
        
        

      </tbody>
    </Table>
    </Row>
    
    {Formstatus&&<AddForm Formstatus={Formstatus} AddDescription={props.AddDescription}/>}
    </Container>
    
    </>
}










export default DescribeTable;