import React, { useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { getHikes } from "../api/hikes";
import HikeCard from "../components/Hike/HikeCard";
import ModalMap from "../components/ModalMap";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import HikeFilters from "../components/Hike/HikeFilters";
import PositionFilterModal from "../components/PositionFilterModal";
import PaginatedList from "../components/pagination/PaginatedList";

const Hikes = () => {
	// ** State
	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState({});
	const [showPositionFilter, setShowPositionFilter] = useState(false);
	const [currentHike, setCurrentHike] = useState(null);

//  async	function test(){
// 		const url = 'http://localhost:8080/api/hike/638085c5ee2abea8b5e58c8c';

// 		const response = await fetch(url, {
// 			credentials: "include",
// 		});
// 		console.log(await response.json());
// 	}

	return (
		<div className="w-100">
			{/* <Button onClick={()=>test()} >test</Button> */}
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
			{openFilters && (
				<HikeFilters
					filters={filters}
					setFilters={setFilters}
					openModal={() => setShowPositionFilter(true)}
				/>
			)}
			<PaginatedList
				dataElement={(hike) => <HikeCard key={hike._id} hike={hike} showDetails={setCurrentHike} />}
				errorElement={(error) => (
					<NoData message={"Something went wrong during the request. Try again later."} />
				)}
				noDataElement={() => <NoData message={"No hikes found."} />}
				loadingElement={() => <Loading />}
				fetchCall={(paginationFilters) =>
					getHikes({
						...filters,
						...paginationFilters,
					})
				}
			/>
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
						locationRadius: radius * 1000,
					});
				}}
				onRemoveFilter={() => {
					setShowPositionFilter(false);
					const { locationCoordinatesLat, locationCoordinatesLng, locationRadius, ...f } = filters;
					setFilters(f);
				}}
			></PositionFilterModal>
			<ModalMap handleClose={() => setCurrentHike(null)} hike={currentHike}></ModalMap>
		</div>
	);
};

export default Hikes;
