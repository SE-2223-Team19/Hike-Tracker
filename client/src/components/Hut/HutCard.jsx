import React from "react";
import { Card, Col, Image, Stack, Button } from "react-bootstrap";
import HutMap from "./HutMap";
import { FaBed } from "react-icons/fa";
import { BiPhone, BiGlobe } from "react-icons/bi";
import { TbMail } from "react-icons/tb";

const HutCard = ({ hut, user, setCurrentHut, setShow }) => {

	const settingProperty = () => {
		setCurrentHut(hut)
		setShow(true)
	}
	return (
		<Card className="mt-4 p-3">
			<h4>{hut.name}</h4>
			<Image
				src={hut.thumbnail.length >= 1 ? hut.thumbnail[0].data : ""}
				rounded
				style={{ maxHeight: "200px", objectFit: "cover", marginTop: "1rem" }}
			/>
			<div className="mt-4">
				<h6>Description</h6>
				<p>{hut.description}</p>
			</div>
			<HutMap hut={hut} />
			<Stack gap={3} className="mt-4">
				<HutIcon icon={<FaBed size={24} />} text={`${hut.numberOfBeds} beds`} />
				<HutIcon icon={<BiPhone size={24} />} text={`${hut.phone}`} />
				<HutIcon icon={<BiGlobe size={24} />} text={`${hut.webSite}`} />
				<HutIcon icon={<TbMail size={24} />} text={`${hut.email}`} />
				<div><Button onClick={() => settingProperty()}>Update Hut</Button></div>
			</Stack>
		</Card>
	);
};

const HutIcon = ({ icon, text }) => {
	return (
		<Stack direction="horizontal" gap={4}>
			<div className="d-flex flex-row">
				{icon}
				<span className="ms-2">{text}</span>
			</div>
		</Stack>
	);
};

export default HutCard;
