import React, { useContext } from "react";
import { Badge, Button, Card, Image, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import NewHikeCondition from "./NewHikeCondition";
import { useNavigate } from "react-router-dom";
import {
	capitalizeAndReplaceUnderscores,
	ConditionColor,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
	getRandomHikeThumbnail,
} from "../../helper/utils";
import { AuthContext } from "../../context/AuthContext";
import { UserType } from "../../helper/enums";
import { startHike, planHike } from "../../api/hikes";

const HikeCard = ({ hike, setDirty }) => {
	const navigate = useNavigate();
	// ** User (if user is not logged in and has not permission, he cannot see hike details)
	const { loggedIn, user, setMessage } = useContext(AuthContext);

	const start = async () => {
		// ** Check if user is a hiker
		if (user.userType !== UserType.HIKER) {
			setMessage({ msg: "You must be a hiker to start a hike", type: "danger" });
			return;
		}

		const startedHike = await startHike(hike._id);
		if (startedHike.status === undefined) {
			setMessage({
				msg: "You have another active hike, you can see it on your profile page under 'Active hikes'",
				type: "danger",
			});
			return;
		} else {
			setMessage({
				msg: "Hike started successfully, you can track it in your profile in the 'Active Hikes' section",
				type: "success",
			});
			return;
		}
	};

	const plan = async () => {
		// ** Check if user is a hiker
		if (user.userType !== UserType.HIKER) {
			setMessage({ msg: "You must be a hiker to start a hike", type: "danger" });
			return;
		}

		const plannedHike = await planHike(hike._id);
		if (plannedHike.status !== undefined) {
			setMessage({
				msg: "Hike planned successfully, you can see it in your profile in the 'Planned Hikes' section",
				type: "success",
			});
		} else {
			setMessage({ msg: "Error in planning hike", type: "danger" });
		}
	};

	return (
		<Card className="flex-row p-3 mt-4">
			<Image
				src={hike.thumbnail.length >= 1 ? hike.thumbnail[0].data : getRandomHikeThumbnail()}
				alt="hike"
				fluid
				height="100%"
				width="20%"
				rounded
				style={{ maxHeight: "150px", objectFit: "cover" }}
				className="d-none d-lg-block" // Hide image on small screens
			/>
			<Card.Body className="py-0">
				<Stack className="h-100" style={{ justifyContent: "space-between" }}>
					<Card.Title>
						<Stack direction="horizontal" className="justify-content-between align-items-center">
							<h5>{hike.title}</h5>
							<Badge bg={difficultyToColor(hike.difficulty)}>
								{capitalizeAndReplaceUnderscores(hike.difficulty)}
							</Badge>
						</Stack>
						<Stack direction="horizontal" className="justify-content-between align-items-center">
							<Badge bg={ConditionColor(hike.hikeCondition)}>{hike.hikeCondition}</Badge>
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
										<Button variant="dark" onClick={() => navigate("/hike", { state: { hike } })}>
											Details
										</Button>
										{user.userType === UserType.HIKER && (
											<Button variant="outline-success" onClick={() => start()}>
												Start
											</Button>
										)}
										{user.userType === UserType.HIKER && (
											<Button variant="info" onClick={() => plan()}>
												Plan
											</Button>
										)}
									</Stack>
								)}
							</div>
						</Stack>
						<div className="mt-4">{hike.description}</div>
					</>
				</Stack>
			</Card.Body>
		</Card>
	);
};

export default HikeCard;
