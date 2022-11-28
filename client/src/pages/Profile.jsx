import React, { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserType } from "../helper/enums";
import LocalGuideProfile from "./profiles/LocalGuideProfile";

// TODO: Modify the Profile page based on the user type (for now only local_guide)

const Profile = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user]);

	return (
		user && 
			<ProfileSwitch user={user} />
	);
};

const ProfileSwitch = ({ user }) => {
	switch (user.userType) {
		case UserType.LOCAL_GUIDE:
			return (
				<LocalGuideProfile user={user} />
			);
		default:
			break;
	}
};

export default Profile;
