import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = (props) => {
	return (
		<div>
			<h1>Home</h1>
			{props.loggedIn ? <Button variant="light" onClick={() => { props.logout() }}> Logout</Button> : <Link to={"/login"}>
				<Button variant="success">Login</Button>
			</Link>}
		</div>
	);
};

export default Home;
