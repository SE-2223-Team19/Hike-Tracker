import React, { useState, useEffect, useContext } from "react";
import { Button, Stack, Card, Form, Row, Col, Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getParkingLots } from "../api/locations";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import PositionFilterModal from "../components/PositionFilterModal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PaginatedList from "../components/pagination/PaginatedList";
import ParkingLotCard from "../components/ParkingLot/ParkingLotCard";
import ParkingLotFilters from "../components/ParkingLot/ParkingLotFilters";
import { UserType } from "../helper/enums";

function ParkingLots() {
	const navigate = useNavigate();
	const { user, setMessage } = useContext(AuthContext);
	let userType = user ? user.userType : undefined;

	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState({});
	const [showPositionFilter, setShowPositionFilter] = useState(false);

	// ** Fetch hikes from API
	useEffect(() => {
		if (!user) {
			navigate("/");
			setMessage({ type: "danger", msg: "You must be logged in to access this page" });
		}
	}, [user, navigate, setMessage]);

	return (
		<div className="w-100">
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>Parking Lots</h1>
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
				{
					(userType === UserType.LOCAL_GUIDE || userType === UserType.PLATFORM_MANAGER) &&
					<Button variant="success" onClick={() => navigate("/describe-parking")}>
						Create Parking Lot
					</Button>
				}
			</Stack>
			{/* Filters */}
			{openFilters && (
				<ParkingLotFilters
					filters={filters}
					setFilters={setFilters}
					openModal={() => setShowPositionFilter(true)}
				/>
			)}
			<>
				<PaginatedList
					dataElement={(parkingLot) => (
						<ParkingLotCard key={parkingLot._id} parkingLot={parkingLot} />
					)}
					dataContainer={({ children }) => (
						<Row className="g-4 row-cols-1 row-cols-sm-1 row-cols-md-3">{children}</Row>
					)}
					errorElement={(error) => <NoData message={error} />}
					noDataElement={() => <NoData message={"No parking lots found."} />}
					loadingElement={() => <Loading />}
					fetchCall={getParkingLots}
					filters={filters}
				/>
			</>
			<PositionFilterModal
				show={showPositionFilter}
				setShow={setShowPositionFilter}
				onCancel={() => setShowPositionFilter(false)}
				onOk={(coordinates, radius) => {
					setShowPositionFilter(false);
					setFilters({
						...filters,
						locationLat: coordinates[0],
						locationLon: coordinates[1],
						locationRadius: radius * 1000,
					});
				}}
			></PositionFilterModal>
		</div>
	);
}

export default ParkingLots;
