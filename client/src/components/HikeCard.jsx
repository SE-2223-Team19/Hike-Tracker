import React from "react";
import { Badge, Button, Card, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import { capitalizeAndReplaceUnderscores, displayExpectedTime, metersToKm } from "../helper/utils";

const HikeCard = ({ hike, showDetails }) => {
	return (
		<Card className="flex-row p-3 mt-4">
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
							<span className="ms-1">{metersToKm(hike.length)} Km</span>
						</div>
						<div className="d-flex flex-row">
							<BiTrendingUp size={24} />
							<span className="ms-1">{hike.ascent} m</span>
						</div>
						<div className="d-flex flex-row">
							<BiTime size={24} />
							<span className="ms-1">{displayExpectedTime(hike.expectedTime)}</span>
						</div>
						<div className="ms-auto">
							<Button onClick={() => showDetails(hike)} variant={"success"}>
								See on Map
							</Button>
						</div>
					</Stack>
					<div className="mt-4">{hike.description}</div>
				</>
			</Card.Body>
		</Card>
	);
};

export default HikeCard;
