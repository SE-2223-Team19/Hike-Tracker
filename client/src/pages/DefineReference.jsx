import { React } from "react";
import DefineReferenceForm from "../components/DefineReferenceForm";
import { CgArrowLeft } from "react-icons/cg";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import GenericError from "./errors/GenericError";

function DefineReferencepage() {
	const navigate = useNavigate();
	const location = useLocation();

	if (!location.state) {
		return <GenericError />;
	}

	const { hike } = location.state;
	if (!hike) {
		return <GenericError />;
	}

	return (
		<>
			<Button variant="outline-dark" onClick={() => navigate(-1)}>
				<CgArrowLeft className="me-2" />
				<span>Back</span>
			</Button>
			<h1 className="my-4">Add Reference Point to {hike.title}</h1>
			<DefineReferenceForm hike={hike} />
		</>
	);
}

export default DefineReferencepage;
