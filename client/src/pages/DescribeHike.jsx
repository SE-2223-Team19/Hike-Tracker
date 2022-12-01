import React from "react";
import DescribeHikeForm from "../components/Hike/DescribeHikeForm";
import { CgArrowLeft } from "react-icons/cg";
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function DescribeHike() {
	const navigate = useNavigate();
	const { hike } = useLocation().state || { hike: null };

	return (
		<>
			<Button variant="outline-dark" onClick={() => navigate(-1)}>
				<CgArrowLeft className="me-2" />
				<span>Back</span>
			</Button>
			<h1 className="my-4">{hike ? "Update" : "Describe"} Hike</h1>
			<DescribeHikeForm hike={hike} />
		</>
	);
}

export default DescribeHike;
