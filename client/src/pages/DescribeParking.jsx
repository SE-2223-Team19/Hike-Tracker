import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CgArrowLeft } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import DescribeParkingForm from "../components/DescribeParkingForm";

function DescribeParking() {

	const navigate = useNavigate();

	return (
		<>
			<Row>
				<Col>
					<Button variant="outline-dark" onClick={() => navigate("/parking-lots")}>
						<CgArrowLeft />
						<span>Back</span>
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<h1 className="mb-5">Describe Parking Lot</h1>
				</Col>
			</Row>
			<Row>
				<DescribeParkingForm />
			</Row>
		</>
	);
}

export default DescribeParking;
