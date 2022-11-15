import React from "react";
import DescribeHikeForm from "../components/DescribeHikeForm";

function DescribeHike() {
	const createHike = (hike) => {
		console.log(hike);
	};

	return (
		<>
			<h1 className="mb-5">Describe Hike</h1>
			<DescribeHikeForm createHike={createHike} />
		</>
	);
}

export default DescribeHike;
