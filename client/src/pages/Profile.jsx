import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import { getHikes } from "../api/hikes.js";
import HikeCard from "../components/HikeCard";
import ModalMap from "../components/ModalMap";



const Profile = () => {
	const navigate = useNavigate();
	const { user, handleLogout } = useContext(AuthContext);
	const [hikes, setHikes] = useState([]);
	const [currentHike, setCurrentHike] = useState(null);


	useEffect(() => {
		const fetchHikes = async () => {
			let id = user._id;
			const hikes = await getHikes({});
			if (hikes.error) {
				setHikes(-1);
				return;
			}
			setHikes(hikes);
		};
		fetchHikes();
	}, []);
	let hikesfiltered = Object.values(hikes)[0].filter(h => h.createdBy._id == user._id);

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
			{hikesfiltered.map((hike) => <HikeCard key={hike._id} hike={hike} showDetails={setCurrentHike} from="profile" />)}
			<ModalMap handleClose={() => setCurrentHike(null)} hike={currentHike}></ModalMap>

		</>
	);
};

export default Profile;
