import { React, useState } from "react";
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
import WeatherAlert from "../components/Hike/NewWeatherAlert";
import { AuthContext } from "../context/AuthContext";
import { UserType } from "../helper/enums";
import { useAsyncError } from "react-router-dom";
import getWeatherAlertById from "../api/weatherAlert"
import { useEffect } from "react";

const Hikes = () => {
	// ** State
	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState({});
	const [showPositionFilter, setShowPositionFilter] = useState(false);
	const [currentHike, setCurrentHike] = useState(null);
	const [dirty, setDirty] = useState(false);
	const {loggedIn, user } = useContext(AuthContext);
  

	return (
		<div className="w-100">
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1 className="#tests-title">Hikes</h1>
               {loggedIn&&( <div>
				{user.userType === UserType.PLATFORM_MANAGER&&(
						<WeatherAlert  setDirty={setDirty}/>
					)}
				</div>)}
				<Button
					className="#tests-filter-button"
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
				dataElement={(hike) => (
					<HikeCard key={hike._id} hike={hike} showDetails={setCurrentHike} setDirty={setDirty} />
				)}
				errorElement={(error) => (
					<NoData message={"Something went wrong during the request. Try again later."} />
				)}
				noDataElement={() => <NoData message={"No hikes found."} />}
				loadingElement={() => <Loading />}
				fetchCall={getHikes}
				filters={filters}
				dirty={dirty}
				setDirty={setDirty}
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
