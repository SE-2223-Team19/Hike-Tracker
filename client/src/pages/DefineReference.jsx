import { React, useEffect, useContext } from "react";
import DefineReferenceForm from "../components/DefineReferenceForm";
import { CgArrowLeft } from "react-icons/cg";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getHikeById } from "../api/hikes";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";

function DefineReferencepage() {
	const { hikeId } = useParams();
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [hike, setHike] = useState(null)

	useEffect(() => {
		async function CheckId() {
			const hike = await getHikeById(hikeId);
			if (user === null) {
				navigate("/");
			} else if (hike.createdBy._id !== user._id) {
				navigate("/profile");
			} else {
				setHike(hike);
			}
		}
		CheckId();
	}, [hikeId, navigate, user]);

	return ( hike &&
		<Container>
			<Row>
				<Col>
					<Button variant="outline-dark" onClick={() => navigate("/profile")}>
						<CgArrowLeft />
						<span>Back</span>
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<h1 className="md-5">Add Reference Point</h1>
				</Col>
			</Row>
			<Row>
				<DefineReferenceForm hike={hike} />
			</Row>
		</Container>
	);
}

export default DefineReferencepage;
