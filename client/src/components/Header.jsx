import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = () => {
	return (
		<Navbar>
			<Navbar.Brand href="/">
				<img src="./snowed-mountains.png" alt="Hike Tracker" width="36" height="36" />
			</Navbar.Brand>
			<Nav className="ms-auto align-items-center">
				{/* <Nav.Link href="/">Hikes</Nav.Link>
					<Nav.Link href="/">Other #1</Nav.Link>
					<Nav.Link href="/">Other #2</Nav.Link> */}
				<NavLink to="/login" className={"btn btn-outline-success"}>
					{/* If use is logged in, show user info, else show login button */}
					Login
				</NavLink>
			</Nav>
		</Navbar>
	);
};

export default Header;
