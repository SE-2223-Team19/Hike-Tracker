import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Hikes from "./Hikes";

const Home = (props) => {
	return (
		<div>
			<Header />
			<div className="mt-4">
				<Routes>
					<Route path="/" element={<Hikes />} />
				</Routes>
			</div>
		</div>
	);
};

export default Home;
