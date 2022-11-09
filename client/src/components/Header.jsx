import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";

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
				<Nav.Link href="/login">
					{/* If use is logged in, show user info, else show login button */}
					<Button variant="outline-success">Login</Button>
				</Nav.Link>
			</Nav>
		</Navbar>
	);
};

export default Header;
