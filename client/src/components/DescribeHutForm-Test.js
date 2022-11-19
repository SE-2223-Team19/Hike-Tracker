import { useEffect, useState } from "react"
import{Form,Row,Col,Button} from "react-bootstrap"
import { createLocation } from "../api/locations"
import { LocationType } from "../helper/enums"
import {Formik} from "formik"
import * as Yup from "yup";
function DescribeHutForm(){
   
	const [descriptions,setdescriptions]=useState("")
	console.log(descriptions);
	const [pointLat,SetPointLat]=useState("")
	const [location,SetLocation]=useState("")
	const [pointLng,SetPointLng]=useState("")
    

	


const submitHandler=async(X)=>{
	
	//event.preventDefault();
	
	const value = {descriptions,location,pointLat,pointLng}
    await createLocation(value)
	
}

const validation=Yup.object().shape({
	LocationType: Yup.string().required("Required"),
	Description: Yup.string().required("Required"),
	pointLat: Yup.number().required("Required"),
	pointLng:Yup.number().required("Required")
})


	
	return(
<Formik 
initialvalue={{
	LocationType:"",
	Description:"",
	Point:""
}}
onSubmit={(value,{setsubmit})=>{
	setsubmit(true);
    submitHandler(value)
	setsubmit(false)
}}
  validationSchema={validation}
  validateOnChange={false}
  validateOnBlur={false}
  validateOnMount={false}

  
>
{({
				values,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
				errors,
				touched,
				setFieldValue,
				validateField,
			}) => (
<Form noValidate onSubmit={submitHandler}>
					<Row>
						<Col xs={12} md={4}>
							<Form.Group controlId="title" className="mt-3" type="string" value={LocationType.HUT} placeholder="descriptions" onChange={(event)=>{setdescriptions(event.target.value)}}>
								<Form.Label>LocationType</Form.Label>
								<Form.Control
									type="text"
									name="LocationType"
									value={values.title}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.title}
									//alue={}
								/>
								<Form.Control.Feedback type="invalid">LocationType</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="length" className="mt-3">
								<Form.Label>Description</Form.Label>
								<Form.Control
									type="text"
									name="Description"
								/>
								<Form.Control.Feedback type="invalid"></Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="ascent" className="mt-3">
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
							<Form.Group controlId="ascent" className="mt-3">
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
			)}
			
</Formik>
)                    
}
