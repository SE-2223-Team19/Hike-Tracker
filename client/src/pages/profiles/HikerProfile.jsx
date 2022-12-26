import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import { Outlet } from "react-router-dom";
import HikerStatistics from "./HikerStatistics";

const HikerProfile = ({ user }) => {
	return (
		<div>
			<Row>
				<Col xs={12} md={3}>
					<h5>{user.fullName} (Nome Cognome)</h5>
					<p>{user.email} (Email)</p>
					<Badge bg="success">{capitalizeAndReplaceUnderscores(user.userType)} (user type)</Badge>
				</Col>
				<Col xs={12} md={9}>
					<div className="h-100">
						<HikerStatistics />
					</div>
				</Col>
			</Row>
			<Row className="mt-2">
				{/** This outlet comes from react-router-dom for nested routes
				 * - HikerPreferences
				 * - Active Hikes
				 * - Completed Hikes
				 */}
				<Outlet />
			</Row>
		</div>
	);
};

export default HikerProfile;
