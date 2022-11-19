import React from "react";
import { Nav, Navbar, Button, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = (props) => {
	return (
		<Navbar>
			<Navbar.Brand href="/">
				<img src="./snowed-mountains.png" alt="Hike Tracker" width="36" height="36" />
			</Navbar.Brand>

			<Nav className="ms-auto align-items-center">
				{props.message &&
					<Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
				}
			</Nav>
			<Nav className="ms-auto align-items-center">
				{
					props.loggedIn ? 
					<Button variant="secondary" onClick={() => { props.logout() }}>Logout</Button> :
					<>
						<NavLink to="/login" className={"btn btn-outline-success"} onClick={() => { props.setMessage(''); }}>
							Login
						</NavLink>
						<NavLink to="/sign-in" className={"btn btn-success"} onClick={() => { props.setMessage(''); }}>
							Sign In
						</NavLink>
					</>
				}
			</Nav>
		</Navbar>
	);
};

export default Header;
