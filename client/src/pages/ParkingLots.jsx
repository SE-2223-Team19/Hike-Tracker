import React, { useState, useEffect, useContext } from "react";
import { Button, Stack, Card, Form, Row, Col, Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getParkingLots } from "../api/locations";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import PositionFilterModal from "../components/PositionFilterModal";
import * as L from "leaflet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PaginatedList from "../components/pagination/PaginatedList";

function ParkingLots() {
	const navigate = useNavigate();
	const { user, setMessage } = useContext(AuthContext);

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
				<Button variant="success" onClick={() => navigate("/describe-parking")}>
					Create Parking Lot
				</Button>
			</Stack>
			{/* Filters */}
			{openFilters && (
				<ParkingLotFilters
					filters={filters}
					setFilters={setFilters}
					openModal={() => setShowPositionFilter(true)}
				/>
			)}
			<Container>
				<PaginatedList
					dataElement={(parkingLot) => <ParkingLotCard key={parkingLot._id} hut={parkingLot} />}
					dataContainer={({children}) => <Row className="g-4 row-cols-1 row-cols-sm-1 row-cols-md-3">{children}</Row>}
					errorElement={(error) => <NoData message={error} />}
					noDataElement={() => <NoData message={"No parking lots found."} />}
					loadingElement={() => <Loading />}
					fetchCall={getParkingLots}
					filters={filters}
				/>
			</Container>
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

const ParkingLotCard = ({ hut: parkingLot }) => {
	return (
		<Col>
			<Card className="flex-col p-3 mt-4">
				<Card.Body>
					<Card.Title>
						<Stack direction="horizontal" className="justify-content-between align-items-center">
							<h5>Description: {parkingLot.description}</h5>
						</Stack>
					</Card.Title>
					<div>
						<Row className="justify-content-md-center ">
							<MapParking hut={parkingLot} />
						</Row>
					</div>
				</Card.Body>
			</Card>
		</Col>
	);
};

const ParkingLotFilters = ({ filters, setFilters, openModal }) => {
	return (
		<Form>
			<Row className="mt-4">
				<Col xs={12} md={5}>
					<Form.Group>
						<Form.Label>Description</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="string"
								placeholder="Insert a description of parking lot"
								onChange={(event) => {
									setFilters({ ...filters, description: event.target.value });
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Location</Form.Label> <br />
						<Stack direction="horizontal" gap={2}>
							<Button onClick={openModal} variant={"success"}>
								Select area
							</Button>
						</Stack>
					</Form.Group>
				</Col>
			</Row>
		</Form>
	);
};

function MapParking({ hut: parkinglot }) {
	let markerLocation = new L.icon({
		iconUrl: require("../icons/markerLocation.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	return (
		<Col xs={10} className="p-4">
			<MapContainer
				style={{ width: "100%", height: "30vh" }}
				center={parkinglot ? [...parkinglot.point].reverse() : [0, 0]}
				zoom={7}
				scrollWheelZoom={false}
				zoomControl={false}
				dragging={false}
			>
				<Marker position={[...parkinglot.point].reverse()} icon={markerLocation}>
					<Popup>Reference point</Popup>
				</Marker>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			</MapContainer>
		</Col>
	);
}

export default ParkingLots;
