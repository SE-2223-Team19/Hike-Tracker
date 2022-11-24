import React from "react";
import { useContext } from "react";
import { Nav, Navbar, Button, Alert, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
	const { message, setMessage, handleLogout, loggedIn } = useContext(AuthContext);

	return (
		<Navbar>
			<Navbar.Brand href="/">
				<img src="./snowed-mountains.png" alt="Hike Tracker" width="36" height="36" />
			</Navbar.Brand>

			<Nav className="ms-auto align-items-center">
				{message && (
					<Alert variant={message.type} onClose={() => setMessage("")} dismissible>
						{message.msg}
					</Alert>
				)}
			</Nav>
			<Nav className="ms-auto align-items-center">
				{loggedIn ? (
					<Button
						variant="secondary"
						onClick={() => {
							handleLogout();
						}}
					>
						Logout
					</Button>
				) : (
					<Stack direction="horizontal" gap={4}>
						<NavLink
							to="/login"
							className={"btn btn-outline-success"}
							onClick={() => {
								setMessage("");
							}}
						>
							Login
						</NavLink>
						<NavLink
							to="/sign-in"
							className={"btn btn-success"}
							onClick={() => {
								setMessage("");
							}}
						>
							Sign In
						</NavLink>
					</Stack>
				)}
			</Nav>
		</Navbar>
	);
};

export default Header;
