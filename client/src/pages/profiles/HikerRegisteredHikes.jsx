import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getRegisteredHikesForUser } from "../../api/hikes";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import RegisteredHikeCard from "../../components/Hike/RegisteredHikeCard";
import { UserType } from "../../helper/enums";

const HikerRegisteredHikes = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [registeredHikes, setRegisteredHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		const fetchActiveHikes = async () => {
			const response = await getRegisteredHikesForUser(user._id);
			if (response) {
				setRegisteredHikes(response);
				setLoading(false);
				return;
			}
			setLoading(false);
			setDirty(false);
		};

		if (user && user.userType === UserType.HIKER) {
			if (dirty) {
				setLoading(true);
				fetchActiveHikes();
			}
			return;
		}

		navigate("/profile");
	}, [user, navigate, dirty]);

	return (
		<div>
			<h2>Active Hikes</h2>
			{loading && <Loading />}
			{!loading && registeredHikes.length === 0 && <p>No active hikes</p>}
			{!loading &&
				registeredHikes.length > 0 &&
				registeredHikes.map((hike) => <RegisteredHikeCard key={hike._id} registeredHike={hike} setDirty={setDirty} />)}
		</div>
	);
};

export default HikerRegisteredHikes;
