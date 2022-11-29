import React from "react";
import { Button, Stack } from "react-bootstrap";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const GenericError = ({
	message = "Something went wrong",
	buttonText = "Return to home",
	buttonOnClick = undefined,
}) => {
	const navigate = useNavigate();

	return (
		<Stack className="justify-content-center align-items-center" gap={3}>
			<BiErrorCircle size={42} color="red" />
			<h4 className="text-danger">{message}</h4>
			<Button variant="dark" onClick={() => (buttonOnClick ? buttonOnClick() : navigate("/"))}>
				{buttonText}
			</Button>
		</Stack>
	);
};

export default GenericError;
