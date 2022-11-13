import React from "react";
import { Badge, Card, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import { capitalizeAndReplaceUnderscores, displayExpectedTime } from "../helper/utils";

const HikeCard = ({ hike }) => {
	console.log(hike.title);

	return (
		<Card className="flex-row p-3 mt-4">
			{/* <Card.Img variant="left" src="https://via.placeholder.com/150" height={150} width={150} /> */}
			<Card.Body>
				<Card.Title>
					<Stack direction="horizontal" className="justify-content-between align-items-center">
						<h5>{hike.title}</h5>
						<Badge bg="secondary">{capitalizeAndReplaceUnderscores(hike.difficulty)}</Badge>
					</Stack>
				</Card.Title>
				<>
					<Stack direction="horizontal" gap={4} className="mt-4">
						<div className="d-flex flex-row">
							<BiRuler size={24} />
							<span className="ms-1">{hike.length} Km</span>
						</div>
						<div className="d-flex flex-row">
							<BiTrendingUp size={24} />
							<span className="ms-1">{hike.ascent} m</span>
						</div>
						<div className="d-flex flex-row">
							<BiTime size={24} />
							<span className="ms-1">{displayExpectedTime(hike.expectedTime)}</span>
						</div>
					</Stack>
					<div className="mt-4">{hike.description}</div>
				</>
			</Card.Body>
		</Card>
	);
};

export default HikeCard;
