import React, { useContext } from "react";
import { Badge, Card, Image, Stack, Button } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime, BiPlay, BiStop } from "react-icons/bi";
import { RegisteredHikeStatus } from "../../helper/enums";
import { endHike, startHikePlanned } from "../../api/hikes";
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

const RegisteredHikeCard = ({ registeredHike, setDirty }) => {
	const { user, setMessage } = useContext(AuthContext);
	const { hike, status } = registeredHike;

	const end = async () => {
		const res = await endHike(registeredHike._id);
		if (res !== null) {
			setDirty(true);
		}
	};

	const start = async () => {
		// ** Check if user is a hiker
		if (user.userType !== UserType.HIKER) {
			setMessage({ msg: "You must be a hiker to start a hike", type: "danger" });
			return;
		}

		const startedHikePlanned = await startHikePlanned(registeredHike._id);
		if (startedHikePlanned) {
			setMessage({
				msg: "Hike started successfully, you can track it in 'Active hikes' section",
				type: "success",
			});
			setDirty(true);
			return;
		}

		// ** Error
		setMessage({ msg: "Error starting hike", type: "danger" });
	};

	return (
		<Card className="flex-row p-3 mt-4">
			<Image
				src={
					hike.thumbnail && hike.thumbnail.length >= 1
						? hike.thumbnail[0].data
						: getRandomHikeThumbnail()
				}
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
							<Badge bg={ConditionColor(hike.hikeCondition)}>{hike.hikeCondition}</Badge>{" "}
							<Badge bg={difficultyToColor(hike.difficulty)}>
								{capitalizeAndReplaceUnderscores(hike.difficulty)}
							</Badge>
							<Badge bg={status === "active" ? "danger" : "success"}>
								{capitalizeAndReplaceUnderscores(status.toString())}
							</Badge>
						</Stack>
					</Card.Title>
					{registeredHike.status === RegisteredHikeStatus.ACTIVE && (
						<Stack direction="horizontal" gap={4}>
							<div className="ms-auto">
								<Button variant="outline-danger" onClick={() => end()}>
									Stop
								</Button>
							</div>
						</Stack>
					)}
					{registeredHike.status === RegisteredHikeStatus.PLANNED && (
						<Stack direction="horizontal" gap={4}>
							<div className="ms-auto">
								<Button variant="outline-success" onClick={() => start()}>
									Start
								</Button>
							</div>
						</Stack>
					)}
					<Stack direction="horizontal" gap={4}>
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
						{registeredHike.status !== RegisteredHikeStatus.PLANNED &&
							<div className="d-flex flex-row ms-auto">
								<BiPlay size={24} />
								<span className="ms-1">{new Date(registeredHike.startTime).toUTCString()}</span>
							</div>}
						{registeredHike.status === RegisteredHikeStatus.COMPLETED && (
							<div className="d-flex flex-row">
								<BiStop size={24} />
								<span className="ms-1">{new Date(registeredHike.endTime).toUTCString()}</span>
							</div>
						)}
					</Stack>
				</Stack>
			</Card.Body>
		</Card>
	);
};

export default RegisteredHikeCard;
