import React, { useContext } from "react";
import { Badge, Button, Card, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
	capitalizeAndReplaceUnderscores,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
} from "../../helper/utils";
import { AuthContext } from "../../context/AuthContext";

const HikeCard = ({ hike, showDetails, from }) => {
	const navigate = useNavigate();
	// ** User (if user is not logged in cannot see hike details)
	const { loggedIn } = useContext(AuthContext);

	return (
		<Card className="flex-row p-3 mt-4" onClick={() => navigate("/hike", { state: { hike } })}>
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
					<Stack direction="horizontal" className="align-items-center mt-4">
						<div className="mt-4">{hike.description}</div>
						<div className="ms-auto">
							{from === "profile" ? (
								<div>
									<Button onClick={() => navigate("/reference-point/" + hike._id)}>
										Add reference points
									</Button>
								</div>
							) : null}
						</div>
						<div className="ms-3">
							{from === "profile" ? (
								<Button variant="success" onClick={() => showDetails(hike)}>
									Update
								</Button>
							) : null}
						</div>
					</Stack>
				</>
			</Card.Body>
		</Card>
	);
};

export default HikeCard;
