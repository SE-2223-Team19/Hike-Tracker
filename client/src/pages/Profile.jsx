import React, { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserType } from "../helper/enums";
import LocalGuideProfile from "./profiles/LocalGuideProfile";
import PlatformManagerProfile from "./profiles/PlatformManagerProfile";

// TODO: Modify the Profile page based on the user type (for now only local_guide)

const Profile = () => {
	const navigate = useNavigate();
	const { user, loggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (!loggedIn) {
			navigate("/");
		}
	}, [loggedIn, navigate]);

	return (
		loggedIn && <ProfileSwitch user={user} />
	);
};

const ProfileSwitch = ({ user }) => {
	switch (user.userType) {
		case UserType.LOCAL_GUIDE:
			return <LocalGuideProfile user={user} />;
		case UserType.PLATFORM_MANAGER:
			return <PlatformManagerProfile />;
		default:
			break;
	}
};

export default Profile;
