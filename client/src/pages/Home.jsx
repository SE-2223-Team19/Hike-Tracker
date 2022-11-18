import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import DescribeHike from "./DescribeHike";
import Hikes from "./Hikes";
import DescribeHutForm from "../components/DescribeHutForm";

const Home = (props) => {
	return (
		<div>
			<Header />
			<div className="mt-4">
				<Routes>
					<Route path="/" element={<Hikes />} />
					<Route path="/describe-hike" element={<DescribeHike />} />
					<Route path="/hut" element={<DescribeHutForm/>} />
				</Routes>
			</div>
		</div>
	);
};

export default Home;
