import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getRegisteredHikesForUser } from "../../api/hikes";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import RegisteredHikeCard from "../../components/Hike/RegisteredHikeCard";
import { RegisteredHikeStatus, UserType } from "../../helper/enums";

const HikerRegisteredHikes = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [ActiveHikes, setActiveHikes] = useState([]);
	const [CompletedHikes, setCompletedHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		const fetchActiveHikes = async () => {
			const response = await getRegisteredHikesForUser(user._id);
			if (response) {
				const AH = response.filter(h => h.status === RegisteredHikeStatus.ACTIVE);
				const CH = response.filter(h => h.status === RegisteredHikeStatus.COMPLETED);
				setActiveHikes(AH);
				setCompletedHikes(CH);
				setLoading(false);
				setDirty(false);
			}
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
			{!loading && ActiveHikes.length === 0 && <p>No active hikes</p>}
			{!loading &&
				ActiveHikes.length > 0 &&
				ActiveHikes.map((hike) => <RegisteredHikeCard key={hike._id} registeredHike={hike} setDirty={setDirty} />)}
			<h2>Terminated Hikes: {CompletedHikes.length}</h2>
			{loading && <Loading />}
			{!loading && CompletedHikes.length === 0 && <p>No completed hikes</p>}
			{!loading &&
				CompletedHikes.length > 0 &&
				CompletedHikes.map((hike) => <RegisteredHikeCard key={hike._id} registeredHike={hike} setDirty={setDirty} />)}
		</div>
	);
};

export default HikerRegisteredHikes;
