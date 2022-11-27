import { React, useEffect, useContext } from "react";
import DefineReferenceForm from "../components/DefineReferenceForm";
import { Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getHikeById } from "../api/hikes";
import { AuthContext } from "../context/AuthContext";

function DefineReferencepage() {
	const { hikeId } = useParams();
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		async function CheckId() {
			const hike = await getHikeById(hikeId);
			if (user === undefined) {
				navigate("/");
			} else if (hike.createdBy._id !== user._id) {
				navigate("/profile");
			}
		}
		CheckId();
	}, [hikeId, navigate, user]);

	return (
		<Container>
			<h1 className="md-5">Add Reference Point</h1>
			<DefineReferenceForm hikeId={hikeId} />
		</Container>
	);
}

export default DefineReferencepage;
