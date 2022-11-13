import { useState } from "react";
import { Form ,Button, Table, Container} from "react-bootstrap";
import DescribeTable from "../pages/Describehikes";
//import Hike from "../../../server/models/hike-model";
import Hike from "../testdb";


function AddForm(props){
const [code,setcode]=useState('')
const [Title,setTitle]=useState('')
const [Length,setLength]=useState('')
const [ascent,setascent]=useState('')
const [expectedTime,setexpectedTime]=useState('')
const [difficulty,setdifficulty]=useState('')
const [description,setdescription]=useState('')
const [startPoint,setstartPoint]=useState('')
const [endPoint,setendPoint]=useState('')
const [referencePoints,setreferencePoints]=useState('')




const handlesubmit=(event)=>{
  event.perventDefault();
  props.AddDescription(new Hike(Title,Length,ascent,expectedTime,difficulty,description,startPoint,endPoint,referencePoints))
  props.setFormstatus(false)
}


    return<>
    
   <div style={{borderColor:'gray',borderWidth:2,borderStyle:'dotted',padding:10}}>
   <Form onSubmit={handlesubmit}>
          
          <Form.Group  className="mb-3">
          <Form.Label  htmlFor="Title"> Title</Form.Label>
          <Form.Control type="string" id="Title" placeholder="Title" onChange={(event)=>{setTitle(event.target.value)}}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label  htmlFor="length">Length</Form.Label>
          <Form.Control type="number" id="length" placeholder="length" onChange={(event)=>{setLength(event.target.value)}} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="ascent">Ascent</Form.Label>
          <Form.Control type="number" id="ascent" placeholder="ascent" onChange={(event)=>{setascent(event.target.value)}}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="expectedTime">ExpectedTime</Form.Label>
          <Form.Control type="number"  id="expectedTime" placeholder="expectedTime(hour)" onChange={(event)=>{setexpectedTime(event.target.value)}}/>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label htmlFor="difficulty">difficulty</Form.Label>
          <Form.Control type="string" id="difficulty" placeholder="difficulty" onChange={(event)=>{setdifficulty(event.target.value)}}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">description</Form.Label>
          <Form.Control type="string" id="description" placeholder="description" onChange={(event)=>{setdescription(event.target.value)}}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="startPoint">startPoint</Form.Label>
          <Form.Control type="string" id="startPoint" placeholder="startPoint" onChange={(event)=>{setstartPoint(event.target.value)}}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="endPoint">endPoint</Form.Label>
          <Form.Control type="string" id="endPoint" placeholder="endPoint" onChange={(event)=>{setendPoint(event.target.value)}}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="referencePoints">referencePoints</Form.Label>
          <Form.Control type="string" id="referencePoints" placeholder="referencePoints" onChange={(event)=>{setreferencePoints(event.target.value)}}/>
        </Form.Group>
        <Button type='submit' variant="primary" size="lg">
          Submit
        </Button>{' '}
        <Button variant="secondary" size="lg" onClick={()=>{props.setFormstatus(false)}}>
          Cancel
        </Button>
      
    </Form>
    </div>
    
    
    
   </>
}

export default AddForm;