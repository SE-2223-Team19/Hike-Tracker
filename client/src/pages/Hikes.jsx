import React, { useState, useEffect } from "react";
import { Button, Stack } from "react-bootstrap";
import { getHikes } from "../api/hikes";
import HikeCard from "../components/HikeCard";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import HikeFilters from "../components/HikeFilters";

const Hikes = () => {
	// ** State
	const [hikes, setHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState({});

	// ** Fetch hikes from API
	useEffect(() => {
		setLoading(true);
		const fetchHikes = async () => {
			console.log(filters);
			const hikes = await getHikes(filters);
			setHikes(hikes);
			setLoading(false);
		};
		fetchHikes();
	}, [filters]);

	return (
		<div className="w-100">
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>Hikes</h1>
				<Button
					variant={openFilters ? "success" : "outline-success"}
					style={{ borderRadius: 20 }}
					onClick={() => {
						setOpenFilters(!openFilters);
						if (openFilters) {
							setFilters({}); // Clear filters
						}
					}}
				>
					<CgOptions style={{ marginRight: ".4rem" }} />
					Filters
				</Button>
			</Stack>
			{/* Filters */}
			{openFilters && <HikeFilters filters={filters} setFilters={setFilters} />}
			{loading && <Loading />}
			{(!hikes || hikes.length <= 0) && !loading && <NoData message={"No hikes found."} />}
			{hikes.length > 0 && !loading && hikes.map((hike) => <HikeCard key={hike._id} hike={hike} />)}
		</div>
	);
};

export default Hikes;
