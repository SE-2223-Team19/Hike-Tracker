import { createLocation } from "../api/locations";
import {useState} from "react"
import{Form,Row,Col,Button,Card} from "react-bootstrap"
import {LocationType} from "../helper/enums"
import {Formik} from "formik"
function DescribeHutForm(){
   
	const [descriptions,setdescriptions]=useState("")
	//console.log(descriptions);
    //const [location,SetLocation]=useState("")
	const [pointLat,SetPointLat]=useState("")
    const [pointLng,SetPointLng]=useState("")
    
   
   
    async function handlesubmit(event){ 
      event.preventDefault()
     let data={
        locationType:"hut",
        description: descriptions,
        point:[pointLat,pointLng]

     }
     

      console.log(data);
      await createLocation(data)
    }
    


return(



<Form onSubmit={handlesubmit}>
					<Row>
						
						<Col xs={12} md={4}>
							<Form.Group controlId="length" className="mt-3" value={descriptions}  onChange={(event)=>{setdescriptions(event.target.value)}}>
								<Form.Label>Description</Form.Label>
								<Form.Control
									type="text"
									name="Description"
								/>
								<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="ascent" className="mt-3"  value={pointLat}  onChange={(event)=>{SetPointLat(event.target.value)}}>
								<Form.Label>Latitude Point</Form.Label>
								<Form.Control
									type="number"
									name="Latitude"
								/>
								<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					
					<Row>
					<Col xs={12} md={4}>
							<Form.Group controlId="ascent" className="mt-3"  value={pointLng} onChange={(event)=>{SetPointLng(event.target.value)}}>
								<Form.Label>Longitude Point</Form.Label>
								<Form.Control
									Type="number"
									name="Longitude"
								/>
								<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
							</Form.Group>
						
						</Col>
					</Row>


					<Button variant="success" className="mt-4" type="submit">Create</Button>{' '}
					<Button variant="light" className="mt-4" >Cancel</Button>{' '}
</Form>

)
}

export default DescribeHutForm