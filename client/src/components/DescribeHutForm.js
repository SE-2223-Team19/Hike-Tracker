import { useEffect, useState } from "react"
import{Form,Row,Col,Button} from "react-bootstrap"
import { createLocation } from "../api/locations"
import { LocationType } from "../helper/enums"
import {Formik} from "formik"
function DescribeHutForm(){
   
	const [descriptions,setdescriptions]=useState("")
	const [point,SetPoint]=useState("")
	const [location,SetLocation]=useState("")
    
useEffect(()=>{
	const fetchCreateHunt=async()=>{
		
		const InsertHunt=await createLocation(descriptions,point,location)
	    
	    setdescriptions(InsertHunt)
	
	}
})

function submitHandler(){
	
	
	
	

}
	
	return(
<Formik >
<Form>
					<Row>
						<Col xs={12} md={4}>
							<Form.Group controlId="title" className="mt-3">
								<Form.Label>LocationType</Form.Label>
								<Form.Control
									type="text"
									name="LocationType"
									//alue={}
								/>
								<Form.Control.Feedback type="invalid">LocationType</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="length" className="mt-3">
								<Form.Label>Description</Form.Label>
								<Form.Control
									
								/>
								<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="ascent" className="mt-3">
								<Form.Label>Point</Form.Label>
								<Form.Control
									
								/>
								<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>

					</Row>
					<Row>
						<Col>
						
						</Col>
					</Row>


					<Button variant="success" className="mt-4">Create</Button>{' '}
					<Button variant="light" className="mt-4">Cancel</Button>{' '}
</Form>
</Formik>
)                    
}
export default DescribeHutForm