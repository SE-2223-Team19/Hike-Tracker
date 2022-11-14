import React, { useState, useEffect } from "react";
import { Button, Stack } from "react-bootstrap";
import { getHikes } from "../api/hikes";
import HikeCard from "../components/HikeCard";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import HikeFilters from "../components/HikeFilters";
import PositionFilterModal from "../components/PositionFilterModal";

const Hikes = () => {
	// ** State
	const [hikes, setHikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState({});
	const [showPositionFilter, setShowPositionFilter] = useState(false);

	// ** Fetch hikes from API
	useEffect(() => {
		setLoading(true);
		const fetchHikes = async () => {
			console.log(filters);
			const hikes = await getHikes({ 
				...filters,
				page: 1,
				pageSize: 100
			});
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
			{openFilters && <HikeFilters filters={filters} setFilters={setFilters} openModal={() => setShowPositionFilter(true)}/>}
			{loading && <Loading />}
			{(!hikes || hikes.length <= 0) && !loading && <NoData message={"No hikes found."} />}
			{hikes.length > 0 && !loading && hikes.map((hike) => <HikeCard key={hike._id} hike={hike} />)}
			<PositionFilterModal 
				show={showPositionFilter} 
				setShow={setShowPositionFilter} 
				onCancel={() => setShowPositionFilter(false)} 
				onOk={(coordinates, radius) => {
					setShowPositionFilter(false);
					setFilters({
						...filters,
						locationCoordinatesLat: coordinates[0],
						locationCoordinatesLng: coordinates[1],
						locationRadius: radius * 1000
					});
				}}
			></PositionFilterModal>
		</div>
	);
};

export default Hikes;
