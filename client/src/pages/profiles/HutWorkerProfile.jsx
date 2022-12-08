import { React, useState, useMemo } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { getHuts } from "../../api/locations.js"
import { HutCard } from "../Huts.jsx";
import Loading from "../../components/Loading.jsx";
import NoData from "../../components/NoData";
import PaginatedList from "../../components/pagination/PaginatedList.jsx";
import ModelFormHut from "../../components/ModelFormHut.jsx";

const HutWorkerProfile = ({ user }) => {

	const [currentHut, setCurrentHut] = useState(null);
	const [show, setShow] = useState(false)

	const filter = useMemo(
		() => ({
			workedPeopleId: user._id,
		}),
		[user, show]
	);

	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h2>My Huts</h2>
				<Stack direction="horizontal" gap={3}>
				</Stack>
			</Stack>
			<PaginatedList
				dataElement={(hut) => <HutCard key={hut._id} hut={hut} setCurrentHut={setCurrentHut} user={user} setShow={setShow} />}
				errorElement={(error) => <NoData message={error} />}
				noDataElement={() => <NoData message={"You have not created any hut yet."} />}
				loadingElement={() => <Loading />}
				fetchCall={getHuts}
				filters={filter}
			/>
			<ModelFormHut show = {show} currentHut = {currentHut} setCurrentHut = {setCurrentHut} setShow = {setShow}/>
		</>
	);
};

export default HutWorkerProfile;
