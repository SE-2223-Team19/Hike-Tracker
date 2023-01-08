import React, { useContext } from "react";
import { Badge, Card, Image, Stack, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime, BiPlay, BiStop } from "react-icons/bi";
import { RegisteredHikeStatus } from "../../helper/enums";
import { endHike, startHikePlanned, addRecordPoint } from "../../api/hikes";
import {
	capitalizeAndReplaceUnderscores,
	ConditionColor,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
	getRandomHikeThumbnail,
} from "../../helper/utils";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { UserType } from "../../helper/enums";
import RecordPoint from "../RecordPointForm";
import { useNavigate } from "react-router-dom";

const RegisteredHikeCard = ({ registeredHike, setDirty }) => {
	const { user, setMessage } = useContext(AuthContext);
	const [show, setShow] = useState(false);
	const { _id, hike, status } = registeredHike;
	const navigate = useNavigate();

	const [point, setPoint] = useState(
		registeredHike.recordedPoints[registeredHike.recordedPoints.length - 1]
			? [...registeredHike.recordedPoints[registeredHike.recordedPoints.length - 1]].reverse()
			: [0, 0]
	);

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
		if (JSON.stringify(startedHikePlanned) !== "{}") {
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
	const openModal = async () => {
		setShow(true);
	};

	const checkNotPresence = async (point) => {
		const recordedPoints = await registeredHike.recordedPoints;
		let flag = true;
		for (let i = 0; i < registeredHike.recordedPoints.length; i++) {
			let currPoint = [...recordedPoints[i]].reverse();
			if (currPoint[0] === point[0] && currPoint[1] === point[1]) {
				console.log(currPoint, point);
				flag = false;
			}
		}
		return flag;
	};

	const record = async () => {
		let res = null;

		for (let i = 0; i < point.index; i++) {
			if (await checkNotPresence(registeredHike.hike.referencePoints[i]))
				res = await addRecordPoint(
					registeredHike._id,
					[...registeredHike.hike.referencePoints[i]].reverse()
				);
		}
		if (res !== null) {
			setDirty(true);
		}
	};

	const copyUrlToClipboard = async () => {
		await navigator.clipboard.writeText(`http://localhost:3000/registered-hike/broadcast/${_id}`);
	};

	return (
		<>
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
							<Stack direction="horizontal" className="align-items-center">
								<h5>{hike.title}</h5>
								<Badge bg={ConditionColor(hike.hikeCondition)}>{capitalizeAndReplaceUnderscores(hike.hikeCondition)}</Badge>
								<Badge bg={difficultyToColor(hike.difficulty)} className="ms-auto me-1">
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
									<Stack direction="horizontal" gap={4}>
										<Button variant="outline-danger" onClick={() => end()}>
											Stop
										</Button>
										{!(
											registeredHike.recordedPoints.length ===
											registeredHike.hike.referencePoints.length
										) ? (
											<Button variant="outline-danger" onClick={() => openModal()}>
												Add new Point
											</Button>
										) : (
											<></>
										)}
										<div>
											<OverlayTrigger
												trigger={"click"}
												overlay={(props) => (
													<Tooltip {...props}>Share link copied to clipboard</Tooltip>
												)}
											>
												<Button variant="outline-success" onClick={() => copyUrlToClipboard()}>
													Share
												</Button>
											</OverlayTrigger>
										</div>
										<div>
											<Button variant="dark" onClick={() => navigate("/registered-hike", { state: { registeredHike }})}>
												Details
											</Button>
										</div>
									</Stack>
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
								<div>
									<OverlayTrigger
										trigger={"click"}
										overlay={(props) => (
											<Tooltip {...props}>Share link copied to clipboard</Tooltip>
										)}
									>
										<Button variant="outline-success" onClick={() => copyUrlToClipboard()}>
											Share
										</Button>
									</OverlayTrigger>
								</div>
								<div>
									<Button variant="dark" onClick={() => navigate("/registered-hike", { state: { registeredHike }})}>
										Details
									</Button>
								</div>
							</Stack>
						)}
						{registeredHike.status === RegisteredHikeStatus.COMPLETED && (
							<Stack direction="horizontal" gap={4}>
								<div className="ms-auto">
									<OverlayTrigger
										trigger={"click"}
										overlay={(props) => (
											<Tooltip {...props}>Share link copied to clipboard</Tooltip>
										)}
									>
										<Button variant="outline-success" onClick={() => copyUrlToClipboard()}>
											Share
										</Button>
									</OverlayTrigger>
								</div>
								<div>
									<Button variant="dark" onClick={() => navigate("/registered-hike", { state: { registeredHike }})}>
										Details
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
							{registeredHike.status !== RegisteredHikeStatus.PLANNED && (
								<div className="d-flex flex-row ms-auto">
									<BiPlay size={24} />
									<span className="ms-1">{new Date(registeredHike.startTime).toUTCString()}</span>
								</div>
							)}
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
			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Record Point</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<RecordPoint regHike={registeredHike} setPoint={setPoint} point={point} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShow(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={async () => await record()}>
						Save changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RegisteredHikeCard;
