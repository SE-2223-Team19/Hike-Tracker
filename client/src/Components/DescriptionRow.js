
import {Button} from 'react-bootstrap'


function DescriptionRow(props){
    

    return<tr>
        <Title Description={props.Description.Title}/>
        <Length Description={props.Description.Length}/>
        <Ascent Description={props.Description.Ascent}/>
        <ExpectedTime Description={props.Description.ExpectedTime}/>
        <Difficulty Description={props.Description.Difficulty}/>
        <Description Description={props.Description.Descriotion}/>
        <StartPoint Description={props.Description.StartPoint}/>
        <EndPoint Description={props.Description.EndPoint}/>
        <ReferencePoints Description={props.Description.ReferencePoints}/>
        <ActionButtons Description={props.Description.ActionButtons}/>

    </tr>
}



function Title(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}

function Length(props){
      return<>
    <td className="align-middle">{props.Description}</td>
   </>
}
function Ascent(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}

function ExpectedTime(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}
function Difficulty(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}
function Description(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}
function StartPoint(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}
function EndPoint(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}
function ReferencePoints(props){
    return<>
  <td className="align-middle">{props.Description}</td>
 </>
}
function ActionButtons(props) {
    return (  
       <td> <Button className="rounded-circle" variant="outline-warning" onClick={()=>{props.setFormstatus(true)}}>Edit</Button>{' '}
        <Button className="rounded-circle"  variant="outline-danger" onClick={()=>{}}>Delete</Button>{' '}
        
        </td>
      
    )
  }

export default DescriptionRow