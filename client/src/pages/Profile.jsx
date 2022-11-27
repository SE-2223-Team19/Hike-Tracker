import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import { getHikes } from "../api/hikes.js";
import HikeCard from "../components/HikeCard";
import ModalMap from "../components/ModalMap";
import NoData from "../components/NoData";
import { UserType } from "../helper/enums";

// TODO: Modify the Profile page based on the user type (for now only local_guide)

const Profile = () => {
	const navigate = useNavigate();
	const { user, handleLogout } = useContext(AuthContext);
	const [hikes, setHikes] = useState([]);
	const [currentHike, setCurrentHike] = useState(null);

	useEffect(() => {
		const fetchHikes = async () => {
			const hikes = await getHikes({});
			if (hikes.error) {
				setHikes(-1);
				return;
			}
			let hikesfiltered = hikes.data.filter((h) => h.createdBy._id === user._id);
			setHikes(hikesfiltered);
		};
		if (user) {
			fetchHikes();
		}
	}, [user]);

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
			{user.userType === UserType.LOCAL_GUIDE && (
				<Stack direction="horizontal" className="justify-content-between align-items-center">
					<h2>My Hikes</h2>

					<Stack direction="horizontal" gap={3}>
						<Button variant="success" onClick={() => navigate("/huts")}>
							Huts
						</Button>
						<Button variant="success" onClick={() => navigate("/parking-lots")}>
							Parking Lots
						</Button>
					</Stack>
				</Stack>
			)}
			{!hikes && <NoData />}
			{hikes.length === 0 && <NoData message={"You have not created any hikes yet."} />}
			{hikes.map((hike) => (
				<HikeCard key={hike._id} hike={hike} showDetails={setCurrentHike} from="profile" />
			))}
			<ModalMap handleClose={() => setCurrentHike(null)} hike={currentHike}></ModalMap>
		</>
	);
};

export default Profile;
