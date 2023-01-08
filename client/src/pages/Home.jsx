import { React, useContext } from "react";
import { Alert } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import DefineReferencepage from "./DefineReference";
import DescribeHike from "./DescribeHike";
import DescribeHut from "./DescribeHut";
import DescribeParking from "./DescribeParking";
import Hikes from "./Hikes";
import Huts from "./Huts";
import ParkingLots from "./ParkingLots";
import Profile from "./Profile";
import { AuthContext } from "../context/AuthContext";
import HikeDetail from "./HikeDetail";
import HutDetail from "./HutDetail";
import BroadcastedUrl from "./BroadcastedUrl";
import RegisteredHikeDetail from "./RegisteredHikeDetail";

const Home = () => {
	const { message, setMessage } = useContext(AuthContext);

	return (
		<div>
			<Header />
			{message && (
				<Alert variant={message.type} onClose={() => setMessage("")} dismissible>
					{message.msg}
				</Alert>
			)}
			<div className="mt-4">
				<Routes>
					<Route path="/" element={<Hikes />} />
					<Route path="profile" element={<Profile />} />
					<Route path="/describe-hike" element={<DescribeHike />} />
					<Route path="/hike" element={<HikeDetail />} />
					<Route path="/reference-point" element={<DefineReferencepage />} />
					<Route path="/huts" element={<Huts />} />
					<Route path="/hut" element={<HutDetail />} />
					<Route path="/describe-hut" element={<DescribeHut />} />
					<Route path="/parking-lots" element={<ParkingLots />} />
					<Route path="/describe-parking" element={<DescribeParking />} />
					<Route path="/registered-hike/broadcast/:id" element={<BroadcastedUrl />} />
					<Route path="/registered-hike" element={<RegisteredHikeDetail />} />
				</Routes>
			</div>
		</div>
	);
};

export default Home;
