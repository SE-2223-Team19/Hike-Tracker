import React, { useContext } from "react";
import { Badge, Button, Card, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { Difficulty } from "../helper/enums";
import {
	capitalizeAndReplaceUnderscores,
	displayExpectedTime,
	displayLength,
} from "../helper/utils";

const HikeCard = ({ hike, showDetails }) => {
	// ** User (if user is not logged in cannot see hike details)
	const { loggedIn } = useContext(AuthContext);

	const difficultyToColor = (difficulty) => {
		switch (difficulty) {
			case Difficulty.TOURIST:
				return "info";
			case Difficulty.HIKER:
				return "warning";
			case Difficulty.PROFESSIONAL_HIKER:
				return "danger";
			default:
				return "secondary";
		}
	};

	return (
		<Card className="flex-row p-3 mt-4">
			<Card.Body>
				<Card.Title>
					<Stack direction="horizontal" className="justify-content-between align-items-center">
						<h5>{hike.title}</h5>
						<Badge bg={difficultyToColor(hike.difficulty)}>
							{capitalizeAndReplaceUnderscores(hike.difficulty)}
						</Badge>
					</Stack>
				</Card.Title>
				<>
					<Stack direction="horizontal" gap={4} className="mt-4">
						<div className="d-flex flex-row">
							<BiRuler size={24} />
							<span className="ms-1">{displayLength(hike.length)} Km</span>
						</div>
						<div className="d-flex flex-row">
							<BiTrendingUp size={24} />
							<span className="ms-1">{hike.ascent.toFixed(2)} m</span>
						</div>
						<div className="d-flex flex-row">
							<BiTime size={24} />
							<span className="ms-1">{displayExpectedTime(hike.expectedTime)}</span>
						</div>
						<div className="ms-auto">
							{loggedIn && (
								<Button onClick={() => showDetails(hike)} variant={"success"}>
									See on Map
								</Button>
							)}
						</div>
					</Stack>
					<div className="mt-4">{hike.description}</div>
				</>
			</Card.Body>
		</Card>
	);
};

export default HikeCard;
