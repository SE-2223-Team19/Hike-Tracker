import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserType } from "../helper/enums";
import HikerProfile from "./profiles/HikerProfile";
import LocalGuideProfile from "./profiles/LocalGuideProfile";
import PlatformManagerProfile from "./profiles/PlatformManagerProfile";
import HutWorkerProfile from "./profiles/HutWorkerProfile";
import Home from "../pages/Home";

// TODO: Modify the Profile page based on the user type (for now only local_guide)

const Profile = () => {
	const navigate = useNavigate();
	const { user, loggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (!loggedIn) {
			navigate("/");
		}
	}, [loggedIn, navigate]);

	return <ProfileSwitch user={user} />;
};

const ProfileSwitch = ({ user }) => {
	switch (user.userType) {
		case UserType.LOCAL_GUIDE:
			return <LocalGuideProfile user={user} />;
		case UserType.PLATFORM_MANAGER:
			return <PlatformManagerProfile />;
		case UserType.HIKER:
			return <HikerProfile user={user} />;
		case UserType.HUT_WORKER:
			return <HutWorkerProfile user={user} />;
		default:
			return <Home />;
	}
};

export default Profile;
