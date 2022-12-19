import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getActiveHikesForUser } from "../../api/hikes";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import HikeCardActive from "../../components/Hike/HikeCardActive";

const HikerActiveHikes = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [registeredHikes, setRegisteredHikes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActiveHikes = async () => {
			const response = await getActiveHikesForUser(user._id);
			if (response) {
				setRegisteredHikes(response);
				setLoading(false);
				return;
			}
			setLoading(false);
		};

		if (user) {
			fetchActiveHikes();
			return;
		}

		navigate("/profile/preferences");
	}, [user, navigate]);

	return (
		<div>
			<h2>Active Hikes</h2>
			{loading && <Loading />}
			{!loading && registeredHikes.length === 0 && <p>No active hikes</p>}
			{!loading &&
				registeredHikes.length > 0 &&
				registeredHikes.map((hike) => <HikeCardActive key={hike._id} registeredHike={hike} />)}
		</div>
	);
};

export default HikerActiveHikes;
