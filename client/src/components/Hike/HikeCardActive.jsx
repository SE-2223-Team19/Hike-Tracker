import React from "react";
import { Badge, Card, Image, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import {
	capitalizeAndReplaceUnderscores,
	ConditionColor,
	difficultyToColor,
	displayExpectedTime,
	displayLength,
	getRandomHikeThumbnail,
} from "../../helper/utils";

const HikeCardActive = ({ registeredHike }) => {
	console.log(registeredHike);
	const { hike, status } = registeredHike;

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
						</Stack>
					</>
				</Stack>
			</Card.Body>
		</Card>
	);
};

export default HikeCardActive;
