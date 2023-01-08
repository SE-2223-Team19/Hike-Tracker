import React from "react";
import { Stack } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import ParkingLotMap from "./ParkingLotMap";
import HutIcon from "../Hut/HutIcon";
import { FaParking } from "react-icons/fa";

const ParkingLotCard = ({ parkingLot }) => {
	console.log(parkingLot);

	return (
		<Col>
			<Card className="flex-col p-3 mt-4">
				<Card.Body>
					<Card.Title>
						<Stack direction="horizontal" className="justify-content-between align-items-center">
							<h5>{parkingLot.name}</h5>
							<HutIcon icon={<FaParking />} text={`Capacity: ${parkingLot.capacity}`} />
						</Stack>
					</Card.Title>
					<div>
						<Row className="justify-content-md-center ">
							<ParkingLotMap parkinglot={parkingLot} />
						</Row>
					</div>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default ParkingLotCard;
