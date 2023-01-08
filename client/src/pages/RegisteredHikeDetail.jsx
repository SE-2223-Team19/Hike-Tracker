import React, { useContext, useState, useRef } from "react";
import { Badge, Button, Form, Stack, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { BiRuler, BiTrendingUp, BiTime, BiPlay, BiStop } from "react-icons/bi";
import { RegisteredHikeStatus } from "../helper/enums";
import GenericError from "./errors/GenericError";
import { CgArrowLeft } from "react-icons/cg";
import HikeTrackMap from "../components/Hike/HikeTrackMap";
import {
	capitalizeAndReplaceUnderscores,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
} from "../helper/utils";
import { AuthContext } from "../context/AuthContext";
import { updateRegisteredHike } from "../api/hikes";

const RegisteredHikeDetail = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [updating, setUpdating] = useState(false);
	const startTimeRef = useRef();
	const endTimeRef = useRef();

	const { registeredHike } = location.state;

	if (!registeredHike) {
		return <GenericError />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		const body = {
			startTime: new Date(startTimeRef.current.value),
			endTime: new Date(endTimeRef.current.value),
		};

		const updatedRegisteredHike = await updateRegisteredHike(registeredHike._id, body);
		if (updatedRegisteredHike !== null) {
			return navigate(-1);
		}
	};

	return (
		<>
			<Button variant="outline-dark" onClick={() => navigate(-1)}>
				<CgArrowLeft className="me-2" />
				Back
			</Button>
			<h1 className="mt-4">{registeredHike.hike.title}</h1>
			<Stack direction="horizontal" gap={3} className="me-auto my-4">
				<div className="d-flex flex-row">
					<BiRuler size={24} />
					<span className="ms-1">{displayLength(registeredHike.hike.length)} Km</span>
				</div>
				<div className="d-flex flex-row">
					<BiTrendingUp size={24} />
					<span className="ms-1">{registeredHike.hike.ascent.toFixed(2)} m</span>
				</div>
				<div className="d-flex flex-row">
					<BiTime size={24} />
					<span className="ms-1">{displayExpectedTime(registeredHike.hike.expectedTime)}</span>
				</div>
				<div className="ms-auto">
					<Badge bg={difficultyToColor(registeredHike.hike.difficulty)}>
						{capitalizeAndReplaceUnderscores(registeredHike.hike.difficulty)}
					</Badge>
				</div>
			</Stack>
			<div className="mt-4">{registeredHike.hike.description}</div>
			<div className="mt-4">
				<HikeTrackMap hike={{ ...registeredHike.hike, trackPoints: registeredHike.hike.trackPoints.coordinates }} />
			</div>
			<div className="mt-4">
				{
					registeredHike.user === user._id &&
					<Row>
						<Col className="d-flex">
							<Button variant={"outline-danger"} className="ms-auto" onClick={() => setUpdating(true)}>
								Edit times
							</Button>
						</Col>
					</Row>
				}
				{
					(
						updating &&
						<Form onSubmit={handleSubmit}>
							<Form.Group>
								<Form.Label>Start Time</Form.Label>
								<Form.Control type="datetime-local" ref={startTimeRef} defaultValue={registeredHike.startTime && registeredHike.startTime.slice(0, -8)}></Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>End Time</Form.Label>
								<Form.Control type="datetime-local" ref={endTimeRef} defaultValue={registeredHike.endTime && registeredHike.endTime.slice(0, -8)}></Form.Control>
							</Form.Group>
							<div className="mt-2">
								<Button type="reset" variant="light" onClick={() => setUpdating(false)}>
									Cancel
								</Button>
								<Button type="submit" variant="success" className="ms-1">
									Save
								</Button>
							</div>
						</Form>
					) || 
					<Row>
						<Stack direction="horizontal">
							<div className="d-flex flex-row">
								<BiPlay size={24} />
								<span className="ms-1">{new Date(registeredHike.startTime).toUTCString()}</span>
							</div>
							{registeredHike.status === RegisteredHikeStatus.COMPLETED && (
								<div className="d-flex flex-row">
									<BiStop size={24} />
									<span className="ms-1">{new Date(registeredHike.endTime).toUTCString()}</span>
								</div>
							)}
						</Stack>
					</Row>
				}
			</div>
		</>
	);
};

export default RegisteredHikeDetail;
