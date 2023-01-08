import React from "react";
import { Stack } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Form } from "react-bootstrap";

const ParkingLotFilters = ({ filters, setFilters, openModal }) => {
	return (
		<Form>
			<Row className="mt-4">
				<Col xs={12} md={5}>
					<Form.Group>
						<Form.Label>Description</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="string"
								placeholder="Insert a description of parking lot"
								onChange={(event) => {
									setFilters({ ...filters, description: event.target.value });
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Location</Form.Label> <br />
						<Stack direction="horizontal" gap={2}>
							<Button onClick={openModal} variant={"success"}>
								Select area
							</Button>
						</Stack>
					</Form.Group>
				</Col>
			</Row>
		</Form>
	);
};

export default ParkingLotFilters;
