import React, { useState, useEffect, useContext } from "react";
import { Button, Stack, Form, Row, Col, Container } from "react-bootstrap";
import { getHuts } from "../api/locations";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import PositionFilterModal from "../components/PositionFilterModal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PaginatedList from "../components/pagination/PaginatedList";
import { UserType } from "../helper/enums";
import HutCard from "../components/Hut/HutCard";

function Huts({ setCurrentHut, setShow, dirty, setDirty }) {
	const navigate = useNavigate();
	const { user, setMessage } = useContext(AuthContext);
	const [openFilters, setOpenFilters] = useState(false);
	const [filters, setFilters] = useState(
		user && user.userType === UserType.HUT_WORKER ? { workedPeopleId: user._id } : {}
	);
	const [showPositionFilter, setShowPositionFilter] = useState(false);
	let userType = user ? user.userType : undefined;

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
				<h1>{userType === UserType.HUT_WORKER ? "My Huts" : "Huts"}</h1>
				<Button
					variant={openFilters ? "success" : "outline-success"}
					style={{ borderRadius: 20 }}
					onClick={() => {
						setOpenFilters(!openFilters);
						if (openFilters && userType !== UserType.HUT_WORKER) {
							setFilters({}); // Clear filters
						}
						if (openFilters && userType === UserType.HUT_WORKER) {
							setFilters(user ? { workedPeopleId: user._id } : {});
						}
					}}
				>
					<CgOptions style={{ marginRight: ".4rem" }} />
					Filters
				</Button>
				{userType === UserType.HUT_WORKER ? (
					<></>
				) : (
					<Button variant="success" onClick={() => navigate("/describe-hut")}>
						Create Hut
					</Button>
				)}
			</Stack>
			{/* Filters */}
			{openFilters && (
				<HutFilters
					user={user}
					filters={filters}
					setFilters={setFilters}
					openModal={() => setShowPositionFilter(true)}
				/>
			)}
			<Container>
				<PaginatedList
					dataElement={(hut) => (
						<HutCard
							data-test-id="descriptionHutForm"
							key={hut._id}
							hut={hut}
							setCurrentHut={setCurrentHut}
							user={user}
							setShow={setShow}
						/>
					)}
					dataContainer={({ children }) => (
						<div className="d-flex flex-row row-cols-md-2 mt-4 gap-0">{children}</div>
					)}
					errorElement={(error) => <NoData message={error} />}
					noDataElement={() => <NoData message={"No huts found."} />}
					loadingElement={() => <Loading />}
					fetchCall={getHuts}
					filters={filters}
					dirty={dirty}
					setDirty={setDirty}
				/>
			</Container>
			{!user ? (
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
					onRemoveFilter={() => {
						setShowPositionFilter(false);
						const { locationLat, locationLon, locationRadius, ...f } = filters;
						setFilters(f);
					}}
				></PositionFilterModal>
			) : (
				<></>
			)}
		</div>
	);
}

const HutFilters = ({ filters, setFilters, openModal, user }) => {
	return (
		<Form>
			<Row className="mt-4">
				<Col xs={12} md={5}>
					<Form.Group>
						<Form.Label>
							<strong>Description</strong>
						</Form.Label>
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
					{!user ? (
						<Form.Group>
							<Form.Label>Location</Form.Label> <br />
							<Stack direction="horizontal" gap={2}>
								<Button onClick={openModal} variant={"success"}>
									Select area
								</Button>
							</Stack>
						</Form.Group>
					) : (
						<></>
					)}
				</Col>
			</Row>
		</Form>
	);
};

export default Huts;
