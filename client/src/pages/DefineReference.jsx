import { React } from "react";
import DefineReferenceForm from "../components/DefineReferenceForm";
import { CgArrowLeft } from "react-icons/cg";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import GenericError from "./errors/GenericError";

function DefineReferencepage() {
	const navigate = useNavigate();
	const location = useLocation();

	if (!location.state) {
		return <GenericError />;
	}

	const { hike } = location.state;
	if (!hike) {
		return <GenericError />;
	}

	return ( hike &&
		<Container>
			<Row>
				<Col>
					<Button variant="outline-dark" onClick={() => navigate("/profile")}>
						<CgArrowLeft />
						<span>Back</span>
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<h1 className="md-5">Add Reference Point</h1>
				</Col>
			</Row>
			<Row>
				<DefineReferenceForm hike={hike} />
			</Row>
		</Container>
	);
}

export default DefineReferencepage;
