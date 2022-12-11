import React, { useContext } from "react";
import { Nav, Navbar, Stack, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserType } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import "./Header.css";

const Header = () => {
	const navigate = useNavigate();
	const { setMessage, loggedIn, user, handleLogout } = useContext(AuthContext);

	return (
		<Navbar expand="md">
			<Navbar.Brand href="/">
				<img
					src={"http://localhost:3000/snowed-mountains.png"}
					alt="Hike Tracker"
					width="36"
					height="36"
				/>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="navbar-nav" />
			<Navbar.Collapse id="navbar-nav">
				<Nav>
					<NavLink to="/" className="nav-link">
						Hikes
					</NavLink>
					{(loggedIn && user.userType !== UserType.HUT_WORKER) && (
						<NavLink to="/huts" className="nav-link">
							Huts
						</NavLink>
					)}
					{loggedIn && (
						<NavLink to="/parking-lots" className="nav-link">
							Parking lots
						</NavLink>
					)}
				</Nav>
				<Nav className="ms-auto">
					{loggedIn ? (
						<Dropdown as={Nav.Item}>
							<Dropdown.Toggle as={Nav.Link} className="d-flex flex-row align-items-center gap-3"
								data-test-id="user-dropdown">
								<div className="d-inline-block">
									<div className="d-flex flex-column align-items-end">
										<p className="m-0">{user.fullName}</p>
										<p className="m-0">{capitalizeAndReplaceUnderscores(user.userType)}</p>
									</div>
								</div>
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item data-test-id="profile-button"
									onClick={() => navigate("/profile")} className="dropdown-item">
									Profile
								</Dropdown.Item>
								<Dropdown.Divider></Dropdown.Divider>
								<Dropdown.Item onClick={handleLogout} className="text-danger">
									Logout
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
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
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
