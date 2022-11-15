import React from "react";
import { Badge, Button, Card, Stack } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime } from "react-icons/bi";
import { capitalizeAndReplaceUnderscores, displayExpectedTime } from "../helper/utils";
import { useState } from "react";
import ModalMap from "./ModalMap";

const HikeCard = ({ hike }) => {
	
	const [show, setShow] = useState(false)
	const handleClose = () => setShow(false);
  	const handleShow = () => setShow(true);

	//const positions = hike.positions
	const positions=[
        [40.689818841705, -74.04511194542516],
        [40.75853187779803, -73.98495720388513],
        [40.86151538060051, -74.06201170384256],
        [40.80981015620906, -74.03656769139772],
        [40.80721155324825, -74.04274750092904],
        [40.78901848327006, -74.081199649124],
        [40.764319913561216, -74.08840942691056],
        [40.749756455072884, -74.09493255919364],
        [40.74793579843903, -74.07673645335137],
        [40.675849802727335, -74.19758606169779],
        [40.60394644123212, -74.05991363796608],
        [40.6495463256113, -73.96000671720954],
      ]
	

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
							<span className="ms-1">{hike.length} Km</span>
						</div>
						<div className="d-flex flex-row">
							<BiTrendingUp size={24} />
							<span className="ms-1">{hike.ascent} m</span>
						</div>
						<div className="d-flex flex-row">
							<BiTime size={24} />
							<span className="ms-1">{displayExpectedTime(hike.expectedTime)}</span>
						</div>
						<div><Button onClick={() => handleShow()}>See on Map</Button></div>
					</Stack>
					<div className="mt-4">{hike.description}</div>
					<ModalMap show = {show} handleClose = {handleClose} title = {hike.title} positions = {positions}/>
				</>
			</Card.Body>
		</Card>
	);
};

export default HikeCard;
