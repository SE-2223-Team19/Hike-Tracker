import React from "react";
import { useContext } from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";

const Profile = () => {
	const navigate = useNavigate();
	const { user, handleLogout } = useContext(AuthContext);

	return (
		<>
			<Stack direction="horizontal">
				<Stack>
					<h4 className="mb-2">{user.fullName}</h4>
					<h5 className="mb-4">{capitalizeAndReplaceUnderscores(user.userType)}</h5>
				</Stack>
				<Button variant="success" onClick={() => navigate("/describe-hike")}>
					Create Hike
				</Button>
				<Button variant="outline-danger" className="ms-3" onClick={handleLogout}>
					Logout
				</Button>
			</Stack>
		</>
	);
};

export default Profile;
