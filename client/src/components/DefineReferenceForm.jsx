import { React, useState, useEffect, useContext } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateHike } from "../api/hikes";
import SelectReferencePointsMap from "./SelectReferencePointsMap";
import { AuthContext } from "../context/AuthContext";

function DefineReferenceForm({ hike }) {
	const { setMessage } = useContext(AuthContext);
	const [referencePoints, setReferencePoints] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		setReferencePoints(hike.referencePoints);
	}, [hike.referencePoints]);

	const addReferencePoint = async () => {
		try {
			await updateHike(hike._id, { referencePoints: referencePoints });
			navigate("/profile");
		} catch (err) {
			setMessage(err);
		}
	};

	return (
		<Col>
			<Row>
				<Col style={{"height": "50vh"}}>
					<SelectReferencePointsMap referencePoints={referencePoints} setReferencePoints={setReferencePoints} trackPoints={hike.trackPoints} />
				</Col>
			</Row>
			<Row>
				<Col className="mt-3">
					<Button variant="success" onClick={addReferencePoint}>
						Set reference points
					</Button>
				</Col>
			</Row>
		</Col>
	);
}

export default DefineReferenceForm;
