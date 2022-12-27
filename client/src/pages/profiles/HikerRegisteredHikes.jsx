import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getRegisteredHikesForUser } from "../../api/hikes";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import RegisteredHikeCard from "../../components/Hike/RegisteredHikeCard";
import { RegisteredHikeStatus, UserType } from "../../helper/enums";


const HikerPlannedHikes = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [PlannedHikes, setPlannedHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		const fetchPlannedHikes = async () => {
			const response = await getRegisteredHikesForUser(user._id);
			if (response) {
				const PH = response.filter(h => h.status === RegisteredHikeStatus.PLANNED);
				setPlannedHikes(PH);
				setLoading(false);
				setDirty(false);
			}
		};

		if (user && user.userType === UserType.HIKER) {
			if (dirty) {
				setLoading(true);
				fetchPlannedHikes();
			}
			return;
		}

		navigate("/profile");
	}, [user, navigate, dirty]);

	return (
		<div>
			{loading && <Loading />}
			{PlannedHikes.length !== 0 && <h2>Planned Hikes: {PlannedHikes.length}</h2>}
			{!loading && PlannedHikes.length === 0 && <h2>No planned hikes</h2>}
			{!loading &&
				PlannedHikes.length > 0 &&
				PlannedHikes.map((hike) => <RegisteredHikeCard key={hike._id} registeredHike={hike} setDirty={setDirty} />)}
		</div>
	);
};

const HikerActiveHikes = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [ActiveHikes, setActiveHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		const fetchActiveHikes = async () => {
			const response = await getRegisteredHikesForUser(user._id);
			if (response) {
				const AH = response.filter(h => h.status === RegisteredHikeStatus.ACTIVE);
				setActiveHikes(AH);
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
			{loading && <Loading />}
			{ActiveHikes.length !== 0 && <h2>Active Hikes: {ActiveHikes.length}</h2>}
			{!loading && ActiveHikes.length === 0 && <h2>No active hikes</h2>}
			{!loading &&
				ActiveHikes.length > 0 &&
				ActiveHikes.map((hike) => <RegisteredHikeCard key={hike._id} registeredHike={hike} setDirty={setDirty} />)}
		</div>
	);
};

const HikerTerminetedHikes = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [TerminatedHikes, setTerminatedHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dirty, setDirty] = useState(true);

	useEffect(() => {
		const fetchActiveHikes = async () => {
			const response = await getRegisteredHikesForUser(user._id);
			if (response) {
				const TH = response.filter(h => h.status === RegisteredHikeStatus.COMPLETED);
				setTerminatedHikes(TH);
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
			{loading && <Loading />}
			{TerminatedHikes.length !== 0 && <h2>Terminated Hikes: {TerminatedHikes.length}</h2>}
			{!loading && TerminatedHikes.length === 0 && <h2>No completed hikes</h2>}
			{!loading &&
				TerminatedHikes.length > 0 &&
				TerminatedHikes.map((hike) => <RegisteredHikeCard key={hike._id} registeredHike={hike} setDirty={setDirty} />)}
		</div>
	);
};

export { HikerActiveHikes, HikerTerminetedHikes, HikerPlannedHikes };
