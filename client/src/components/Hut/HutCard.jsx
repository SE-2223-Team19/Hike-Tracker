import React from "react";
import { Card, Image, Stack, Button, Col } from "react-bootstrap";
import HutMap from "./HutMap";
import { FaBed } from "react-icons/fa";
import { BiPhone, BiGlobe } from "react-icons/bi";
import { TbMail } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import HutIcon from "./HutIcon";

const HutCard = ({ hut }) => {
	const navigate = useNavigate();

	return (
		<Col md={6} xs={12}>
			<Card className="mx-0 mt-4 p-3 w-100">
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
					<Button variant="dark" onClick={() => navigate("/hut", { state: { hut } })}>
						Details
					</Button>
				</Stack>
			</Card>
		</Col>
	);
};

export default HutCard;
