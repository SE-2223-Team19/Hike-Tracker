import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { CgArrowLeft } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import DescribeHutForm from "../components/Hut/DescribeHutForm";

function DescribeHut() {
	const navigate = useNavigate();

	return (
		<>
			<Row>
				<Col>
					<Button variant="outline-dark" onClick={() => navigate("/huts")}>
						<CgArrowLeft />
						<span>Back</span>
					</Button>
				</Col>
			</Row>
			<Row className="mt-4">
				<Col>
					<h1 className="mb-3">Describe Hut</h1>
				</Col>
			</Row>
			<Row>
				<DescribeHutForm />
			</Row>
		</>
	);
}

export default DescribeHut;
