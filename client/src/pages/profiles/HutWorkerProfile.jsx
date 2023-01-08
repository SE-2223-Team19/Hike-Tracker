import { React, useState } from "react";
import { Stack } from "react-bootstrap";
import Huts from "../Huts.jsx";

const HutWorkerProfile = ({user}) => {
	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<Stack direction="horizontal" gap={3}>
				</Stack>
			</Stack>
			<Huts />
		</>
	);
};

export default HutWorkerProfile;
