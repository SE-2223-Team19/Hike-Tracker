import React from "react";
import { Container } from "react-bootstrap";

const NoData = ({ message }) => {
	return (
		<Container className="text-center p-5">
			<h5 className="text-danger">{message}</h5>
		</Container>
	);
};

export default NoData;
