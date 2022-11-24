import { useState } from "react";
import {Form,Button,Row,Col} from "react-bootstrap"
import Table from 'react-bootstrap/Table';
import { getHikes } from "../api/hikes";

//const [reference,setreference]=useState("")

async function DataLoad(){
  
  let result =await getHikes()

}

// const editreference = (description) => {
//   console.log(description);
//   const edit= (des)=>(des.map((e)=>(e.Title==description.Title ? description : e)))
//   console.log(edit);
//   //setreference(edit);
//   }


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





// function DescriptionRow(props){
    

//     return<tr>
//        {/* <td className="align-middle p5555">{props.Description.title}</td> */}
  
//         <Description Description={props.Description.Description}/>
//         <StartPoint Description={props.Description.StartPoint}/>
//         <EndPoint Description={props.Description.EndPoint}/>
//         <ReferencePoints Description={props.Description.ReferencePoints}/>
//         <ActionButtons Description={props.Description} RemoveDescriprtion={props.RemoveDescriprtion} setFormstatus={props.setFormstatus} editDescription={props.editDescription} setFormMode={props.setFormMode} formMode={props.formMode} setEditedDescription={props.setEditedDescription}/>

//     </tr>
// }



// function Title(props){
//     return<>
//   <td className="align-middle">{props.Description}</td>
//  </>
// }

// function Description(props){
//     return<>
//   <td className="align-middle">{props.Description}</td>
//  </>
// }
// function StartPoint(props){
//     return<>
//   <td className="align-middle">{props.Description}</td>
//  </>
// }
// function EndPoint(props){
//     return<>
//   <td className="align-middle">{props.Description}</td>
//  </>
// }
// function ReferencePoints(props){
//     return<>
//   <td className="align-middle">{props.Description}</td>
//  </>
// }
// function ActionButtons(props) {
  
  
//     return (  
//        <td> <Button className="rounded-circle" disabled={props.formMode=='edit'} variant="outline-warning" onClick={()=>{props.setFormMode('edit');props.setEditedDescription(props.Description)}}>Edit</Button>{' '}
//         <Button className="rounded-circle" disabled={props.formMode!==''} variant="outline-danger" onClick={()=>{props.RemoveDescriprtion(props.Description.Title)}}>Delete</Button>{' '}
        
//         </td>
      
//     )
//   }




const Reference={DefineReferenceForm, DefineReferenceTable}
export default Reference