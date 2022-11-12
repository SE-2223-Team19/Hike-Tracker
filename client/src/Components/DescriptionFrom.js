import { useState } from "react";
import { Form ,Button, Table, Container} from "react-bootstrap";
import DescribeTable from "../pages/Describehikes";


const handlesubmit=(event)=>{
    event.perventDefault();
}
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
    return<>
    
   <Form>
   
        <Form.Group className="mb-3">
          <Form.Label htmlFor="Title"> Title</Form.Label>
          <Form.Control id="Title" placeholder="Title" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="length">length</Form.Label>
          <Form.Control id="length" placeholder="length" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="ascent">ascent</Form.Label>
          <Form.Control id="ascent" placeholder="ascent" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="expectedTime">expectedTime</Form.Label>
          <Form.Control id="expectedTime" placeholder="expectedTime" />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label htmlFor="difficulty">difficulty</Form.Label>
          <Form.Control id="difficulty" placeholder="difficulty" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">description</Form.Label>
          <Form.Control id="description" placeholder="description" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="startPoint">startPoint</Form.Label>
          <Form.Control id="startPoint" placeholder="startPoint" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="endPoint">endPoint</Form.Label>
          <Form.Control id="endPoint" placeholder="endPoint" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="referencePoints">referencePoints</Form.Label>
          <Form.Control id="referencePoints" placeholder="referencePoints" />
        </Form.Group>
        <div className="mb-2">
        <Button variant="primary" size="lg">
          Submit
        </Button>{' '}
        <Button variant="secondary" size="lg" onClick={()=>{}}>
          Cancel
        </Button>
        </div>
    
    
    </Form>
    
   </>
}

export default AddForm;