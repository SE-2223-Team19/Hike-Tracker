import React from "react";
import { Container, Spinner } from "react-bootstrap";

const Loading = () => {
	return (
		<Container className="d-flex align-items-center justify-content-center w-full p-5">
			<Spinner animation="border" role="status" />
		</Container>
	);
};

export default Loading;
