import React from "react";
import DescribeHikeForm from "../components/DescribeHikeForm";
import { CgArrowLeft } from "react-icons/cg";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function DescribeHike() {

	const navigate = useNavigate();

	return (
		<>
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
					<h1 className="md-5">Describe Hike</h1>
				</Col>
			</Row>
			<Row>
				<DescribeHikeForm />
			</Row>
		</>
	);
}

export default DescribeHike;
