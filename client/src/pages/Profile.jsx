import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserType } from "../helper/enums";
import HutWorkerProfile from "./profiles/HutWorkerProfile";
import LocalGuideProfile from "./profiles/LocalGuideProfile";
<<<<<<< HEAD
import Home from "../pages/Home"
=======
import PlatformManagerProfile from "./profiles/PlatformManagerProfile";
>>>>>>> origin/development

// TODO: Modify the Profile page based on the user type (for now only local_guide)

const Profile = () => {
	const navigate = useNavigate();
	const { user, loggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (!loggedIn) {
			navigate("/");
		}
	}, [loggedIn, navigate]);

<<<<<<< HEAD
	return <ProfileSwitch user={user} />;
=======
	return (
		loggedIn && <ProfileSwitch user={user} />
	);
>>>>>>> origin/development
};

const ProfileSwitch = ({ user }) => {
	switch (user.userType) {
		case UserType.LOCAL_GUIDE:
			return <LocalGuideProfile user={user} />;
<<<<<<< HEAD
		case UserType.HUT_WORKER:
			return <HutWorkerProfile user = {user} />;
=======
		case UserType.PLATFORM_MANAGER:
			return <PlatformManagerProfile />;
>>>>>>> origin/development
		default:
			return <Home/>
	}
};

export default Profile;
