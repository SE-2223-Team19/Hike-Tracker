import { React, useState, useMemo } from "react";
import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getHikes } from "../../api/hikes.js";
import HikeCard from "../../components/Hike/HikeCard";
import Loading from "../../components/Loading.jsx";
import ModalMap from "../../components/ModalMap";
import NoData from "../../components/NoData";
import PaginatedList from "../../components/pagination/PaginatedList.jsx";

// Modify the Profile page based on the user type (for now only local_guide)

const LocalGuideProfile = ({ user }) => {
	const navigate = useNavigate();
	const [currentHike, setCurrentHike] = useState(null);

	const filter = useMemo(
		() => ({
			createdBy: user._id,
		}),
		[user]
	);

	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<h2>My Hikes</h2>

				<Stack direction="horizontal" gap={3}>
					<Button
						data-test-id="create-hike-btn"
						variant="success"
						onClick={() => navigate("/describe-hike")}
					>
						Create Hike
					</Button>
				</Stack>
			</Stack>
			<PaginatedList
				dataElement={(hike) => <HikeCard key={hike._id} hike={hike} showDetails={setCurrentHike} />}
				errorElement={(error) => <NoData message={error} />}
				noDataElement={() => <NoData message={"You have not created any hikes yet."} />}
				loadingElement={() => <Loading />}
				fetchCall={getHikes}
				filters={filter}
			/>
			<ModalMap handleClose={() => setCurrentHike(null)} hike={currentHike}></ModalMap>
		</>
	);
};

export default LocalGuideProfile;
