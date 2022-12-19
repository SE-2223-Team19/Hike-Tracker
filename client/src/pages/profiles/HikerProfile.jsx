import React from "react";
import { Badge, Col, Row, Stack } from "react-bootstrap";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import { Outlet, NavLink } from "react-router-dom";

const HikerProfile = ({ user }) => {
	const activeStyle = {
		background: "#198754", // bootstrap green
		color: "white",
		padding: "0.5rem 1.5rem",
		textDecoration: "none",
		borderRadius: "0.5rem",
	};

	const inactiveStyle = {
		background: "#ececec",
		color: "#198754",
		padding: "0.7rem 1.5rem",
		textDecoration: "none",
		borderRadius: "0.5rem",
	};

	return (
		<div>
			<Row>
				<Col xs={12} md={3}>
					<h5>{user.fullName} (Nome Cognome)</h5>
					<p>{user.email} (Email)</p>
					<Badge bg="success">{capitalizeAndReplaceUnderscores(user.userType)} (user type)</Badge>
				</Col>
				<Col xs={12} md={9}>
					<div className="bg-info h-100">Stats here?</div>
				</Col>
				<Stack direction="horizontal" gap={4} className="mt-4 mb-4">
					<NavLink
						to="preferences"
						style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
					>
						Preferences
					</NavLink>
					<NavLink
						to="active-hikes"
						style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
					>
						Active Hikes
					</NavLink>
					<NavLink
						to="completed-hikes"
						style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
					>
						Completed Hikes
					</NavLink>
				</Stack>
			</Row>
			{/** This outlet comes from react-router-dom for nested routes
			 * - HikerPreferences
			 * - Active Hikes
			 * - Completed Hikes
			 */}
			<Outlet />
		</div>
	);
};

export default HikerProfile;
