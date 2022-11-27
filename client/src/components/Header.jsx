import React from "react";
import { useContext } from "react";
import { Nav, Navbar, Button, Alert, Stack } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";

const Header = () => {
	const navigate = useNavigate();
	const { message, setMessage, loggedIn, user } = useContext(AuthContext);

	return (
		<Navbar>
			<Navbar.Brand href="/">
				<img
					src={"http://localhost:3000/snowed-mountains.png"}
					alt="Hike Tracker"
					width="36"
					height="36"
				/>
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
					<Stack direction="horizontal" gap={6}>
						<div className="d-flex flex-column justify-content-center align-items-end me-3" gap={0}>
							<p className="m-0">{user.fullName}</p>
							<p className="m-0">{capitalizeAndReplaceUnderscores(user.userType)}</p>
						</div>
						<Button
							variant="success"
							onClick={() => {
								navigate("/profile");
							}}
						>
							Profile
						</Button>
					</Stack>
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
