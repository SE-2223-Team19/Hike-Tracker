import { React, useState, useMemo } from "react";
import { Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getHuts } from "../../api/locations.js"
import { HutCard } from "../Huts.jsx";
import Loading from "../../components/Loading.jsx";
import NoData from "../../components/NoData";
import PaginatedList from "../../components/pagination/PaginatedList.jsx";
import ModalMap from "../../components/ModalMap.js";

const HutWorkerProfile = ({ user }) => {
	
    const navigate = useNavigate();
	const [currentHut, setCurrentHut] = useState(null);

	const filter = useMemo(
		() => ({
			workedPeopleId: user._id,
		}),
		[user]
	);

    

	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h2>My Huts</h2>
				<Stack direction="horizontal" gap={3}>
				</Stack>
			</Stack>
			<PaginatedList
				dataElement={(hut) => <HutCard key={hut._id} hut={hut} showDetails={setCurrentHut} />}
				errorElement={(error) => <NoData message={error} />}
				noDataElement={() => <NoData message={"You have not created any hut yet."} />}
				loadingElement={() => <Loading />}
				fetchCall={getHuts}
				filters={filter}
			/>

			<ModalMap handleClose={() => setCurrentHut(null)} hut={currentHut}></ModalMap>
		</>
	);
};

export default HutWorkerProfile;
