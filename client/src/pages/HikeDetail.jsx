import React, { useContext } from "react";
import { Badge, Button, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import GenericError from "./errors/GenericError";
import { CgArrowLeft } from "react-icons/cg";
import HikeTrackMap from "../components/Hike/HikeTrackMap";
import { BiRuler, BiTime, BiTrendingUp } from "react-icons/bi";
import HikeAPI from "../api/hikes"
import {
	capitalizeAndReplaceUnderscores,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
} from "../helper/utils";
import { AuthContext } from "../context/AuthContext";

const HikeDetail = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const { hike } = location.state;

	if (!hike) {
		return <GenericError />;
	}

	const deleteHike = async(id) => {
		await HikeAPI.deleteHikeByID(id)
		navigate(-1)
	}

	return (
		<>
			<Button variant="outline-dark" onClick={() => navigate(-1)}>
				<CgArrowLeft className="me-2" />
				Back
			</Button>
			<h1 className="mt-4">{hike.title}</h1>
			<Stack direction="horizontal" gap={3} className="me-auto my-4">
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
					<Badge bg={difficultyToColor(hike.difficulty)}>
						{capitalizeAndReplaceUnderscores(hike.difficulty)}
					</Badge>
				</div>
			</Stack>
			<div className="mt-4">{hike.description}</div>
			<div className="mt-4">
				<HikeTrackMap hike={hike} />
			</div>
			{/** Only for the creator of the hike */}
			{hike.createdBy._id === user._id && (
				<Stack direction="horizontal" gap={3} className="mt-4">
					<Button variant="outline-danger" onClick={async () => await deleteHike(hike._id)}>
						Delete
					</Button>
					<div className="ms-auto">
						<Button
							variant="primary"
							onClick={() => navigate("/reference-point", { state: { hike } })}
							className="me-3"
						>
							Add Reference Point
						</Button>
						<Button
							variant="success"
							onClick={() => navigate("/describe-hike", { state: { hike } })}
						>
							Update
						</Button>
					</div>
				</Stack>
			)}
		</>
	);
};

export default HikeDetail;
