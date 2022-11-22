import React from "react";
import Reference from "../components/DefineReference";
import Header from "../components/Header";
import {Table,Row, Container,Card} from "react-bootstrap"
function DefineReferencepage() {
	return (
		<>
            <Container>
            <Card>
      <Card.Body><Header/></Card.Body>
             </Card>
             <Table>
                <Row><h1 className="md-5">Define Reference Point</h1></Row>
             </Table>
            <Table>
               <Row><Reference.DefineReferenceTable/></Row>
            </Table>
            <Table>
                
            </Table>
            <Row><Reference.DefineReferenceForm/></Row>
            </Container>

			
               
            
            
		</>
	);
}

export default DefineReferencepage;