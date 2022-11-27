import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import DefineReferencepage from "./DefineReference";
import DescribeHike from "./DescribeHike";
import DescribeHut from "./DescribeHut";
import DescribeParking from "./DescribeParking";
import Hikes from "./Hikes";
import Huts from "./Huts";
import ParkingLots from "./ParkingLots";

const Home = (props) => {
	return (
		<div>
			<Header />
			<div className="mt-4">
				<Routes>
					<Route path="/" element={<Hikes />} />
					<Route path="/describe-hike" element={<DescribeHike />} />
					<Route path="/reference-point/:hikeId" element={<DefineReferencepage />} />
					<Route path="/huts" element={<Huts />} />
					<Route path="/describe-hut" element={<DescribeHut />} />
					<Route path="/parking-lots" element={<ParkingLots />} />
					<Route path="/describe-parking" element={<DescribeParking />} />
				</Routes>
			</div>
		</div>
	);
};

export default Home;
