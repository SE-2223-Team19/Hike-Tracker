import React, { useState, useEffect, useContext } from "react";
import { Button, Stack, Card, Form, Row, Col, Container } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getHuts } from "../api/locations";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import PositionFilterModal from "../components/PositionFilterModal";
import * as L from "leaflet";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PaginatedList from "../components/pagination/PaginatedList";
import { UserType } from "../helper/enums";

function Huts({setCurrentHut, setShow, show}) {

	const navigate = useNavigate();
	const { user, setMessage } = useContext(AuthContext);
	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState((user && user.userType === UserType.HUT_WORKER) ? { workedPeopleId: user._id } : {})
	const [showPositionFilter, setShowPositionFilter] = useState(false);
	let userType = user ? user.userType : undefined

	// ** Fetch huts from API
	useEffect(() => {
		if (!user) {
			navigate("/");
			setMessage({ type: "danger", msg: "You must be logged in to access this page" });

		}
	}, [user, navigate, setMessage]);

	return (
		<div className="w-100">
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h1>{(userType === UserType.HUT_WORKER) ? "My Huts" : "Huts"}</h1>
				<Button
					variant={openFilters ? "success" : "outline-success"}
					style={{ borderRadius: 20 }}
					onClick={() => {
						setOpenFilters(!openFilters);
						if (openFilters && userType !== UserType.HUT_WORKER) {
							setFilters({}); // Clear filters
						}
						if (openFilters && userType === UserType.HUT_WORKER) {
							setFilters(user ? { workedPeopleId: user._id } : {})
						}
					}}
				>
					<CgOptions style={{ marginRight: ".4rem" }} />
					Filters
				</Button>
				{userType === UserType.HUT_WORKER ? <></> : <Button variant="success" onClick={() => navigate("/describe-hut")}>
					Create Hut
				</Button>}
			</Stack>
			{/* Filters */}
			{openFilters && (
				<HutFilters
					user = {user}
					filters={filters}
					setFilters={setFilters}
					openModal={() => setShowPositionFilter(true)}
				/>
			)}
			<Container>
				<PaginatedList
					dataElement={(hut) => <HutCard key={hut._id} hut={hut} setCurrentHut={setCurrentHut} user={user} setShow={setShow} />}
					dataContainer={({ children }) => <Row className="g-4 row-cols-1 row-cols-sm-1 row-cols-md-3">{children}</Row>}
					errorElement={(error) => <NoData message={error} />}
					noDataElement={() => <NoData message={"No huts found."} />}
					loadingElement={() => <Loading />}
					fetchCall={getHuts}
					filters={filters}
					show = {show}
				/>
			</Container>
			{!user ? <PositionFilterModal
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
				onRemoveFilter={() => {
					setShowPositionFilter(false);
					const { locationLat, locationLon, locationRadius, ...f } = filters;
					setFilters(f);
				}}
			></PositionFilterModal> : <></>}
		</div>
	);
}

const HutCard = ({ hut, user, setCurrentHut, setShow }) => {
	return (
		<Col>
			<Card className="flex-col p-3 mt-4">
				<Card.Body>
					<Card.Title>
						<Stack direction="horizontal" className="justify-content-between align-items-center">
							<h6>{hut.name}</h6>
						</Stack>
					</Card.Title>
					<div>
						<Row className="justify-content-md-center ">
							<MapHut hut={hut} />
						</Row>
					</div>
				</Card.Body>
				{user.userType === UserType.HUT_WORKER && <Button variant = "success" onClick={() => {
					setCurrentHut(hut) 
					setShow(true) 
				}}>Update</Button>}
			</Card>
		</Col>
	);
};

const HutFilters = ({ filters, setFilters, openModal, user }) => {
	return (
		<Form>
			<Row className="mt-4">
				<Col xs={12} md={5}>
					<Form.Group>
						<Form.Label><strong>Description</strong></Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="string"
								placeholder="Insert a description of hut"
								onChange={(event) => {
									setFilters({ ...filters, description: event.target.value });
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
				<Col>
					{!user ? <Form.Group>
						<Form.Label>Location</Form.Label> <br />
						<Stack direction="horizontal" gap={2}>
							<Button onClick={openModal} variant={"success"}>
								Select area
							</Button>
						</Stack>
					</Form.Group> : <></>}
				</Col>
			</Row>
		</Form>
	);
};

function MapHut({ hut }) {
	let markerLocation = new L.icon({
		iconUrl: require("../icons/markerLocation.png"),
		iconSize: [35, 45],
		iconAnchor: [17, 46],
		popupAnchor: [0, -46],
	});

	let points = [...hut.point].reverse().reduce((e1, e2) => {
		return "Lat: " + e1.toFixed(2) + ", Lon: " + e2.toFixed(2)
	})

	return (
		<Col xs={10} className="p-2">
			<MapContainer
				style={{ width: "100%", height: "30vh" }}
				center={hut ? [...hut.point].reverse() : [0, 0]}
				zoom={7}
				scrollWheelZoom={false}
				zoomControl={false}
				dragging={false}
				doubleClickZoom={false}
			>
				<Marker position={[...hut.point].reverse()} icon={markerLocation}>
					<Popup>{points}</Popup>
				</Marker>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			</MapContainer>
			<Row className="mt-3">Number of Beds: {hut.numberOfBeds}</Row>
			<Row className="mt-2">Phone: {hut.phone}</Row>
			<Row className="mt-2">Email: {hut.email}</Row>
			<Row className="mt-2">Description: {hut.description}</Row>
			<Row className="mt-2">Web Site: {hut.webSite ? hut.webSite : "Unknown"}</Row>
		</Col>
	);
}

export default Huts;
