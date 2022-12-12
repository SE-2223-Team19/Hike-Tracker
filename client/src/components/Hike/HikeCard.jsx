import React, { useContext } from "react";
import { Badge, Button, Card, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import NewHikeCondition from "./NewHikeCondition";
import { useNavigate } from "react-router-dom";
import {
	capitalizeAndReplaceUnderscores,
	ConditionColor,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
} from "../../helper/utils";
import { AuthContext } from "../../context/AuthContext";
import { UserType } from "../../helper/enums";

const HikeCard = ({ hike, showDetails, setDirty }) => {
	const navigate = useNavigate();
	// ** User (if user is not logged in and has not permission, he cannot see hike details)
	const { loggedIn, user } = useContext(AuthContext);

	return (
		<Card className="flex-row p-3 mt-4">
			<Card.Body>
				<Card.Title>
					<Stack direction="horizontal" className="justify-content-between align-items-center">
						<h5>{hike.title}</h5>
						{
							hike.hikeCondition &&
							<Badge bg={ConditionColor(hike.hikeCondition)}>{capitalizeAndReplaceUnderscores(hike.hikeCondition)}</Badge>
						}
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
								<Stack direction="horizontal" gap={3}>
									{user.userType === UserType.HUT_WORKER && (
										<NewHikeCondition hike={hike} setDirty={setDirty} />
									)}
									<Button
										data-test-id="seeOnMap"
										onClick={() => showDetails(hike)}
										variant={"success"}
									>
										See on Map
									</Button>
									<Button variant="dark" onClick={() => navigate("/hike", { state: { hike } })}>
										Details
									</Button>
								</Stack>
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
