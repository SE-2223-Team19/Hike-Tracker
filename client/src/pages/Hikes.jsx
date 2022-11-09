import React, { useState, useEffect } from "react";
import { getHikes } from "../api/hikes";
import HikeCard from "../components/HikeCard";
import Loading from "../components/Loading";
import NoData from "../components/NoData";

const Hikes = () => {
	const [hikes, setHikes] = useState([]);
	const [loading, setLoading] = useState(true);

	// ** Fetch hikes from API **
	useEffect(() => {
		setLoading(true);
		const fetchHikes = async () => {
			const hikes = await getHikes();
			setHikes(hikes);
			setLoading(false);
		};
		fetchHikes();
	}, []);

	return (
		<div className="w-100">
			<h1>Hikes</h1>
			{loading && <Loading />}
			{hikes.length === 0 && !loading && <NoData message={"No hikes found."} />}
			{hikes.length > 0 && !loading && hikes.map((hike) => <HikeCard key={hike._id} hike={hike} />)}
		</div>
	);
};

export default Hikes;
