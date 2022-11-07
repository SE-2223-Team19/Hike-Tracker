import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div>
			<h1>Home</h1>
			<Link to={"/login"}>
				<Button variant="success">Login</Button>
			</Link>
		</div>
	);
};

export default Home;
