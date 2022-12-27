import React from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import { Outlet, useLocation } from "react-router-dom";
import HikerStatistics from "./HikerStatistics";

const HikerProfile = ({ user }) => {
	const location = useLocation();

	return (
		<div>
			<Row>
				<Col xs={12} md={3}>
					<h5>{user.fullName} (Nome Cognome)</h5>
					<p>{user.email} (Email)</p>
					<Badge bg="success">{capitalizeAndReplaceUnderscores(user.userType)} (user type)</Badge>

					<div className="h-100">
						{location.pathname.includes("preferences") && <HikerStatistics />}
					</div>
				</Col>

				<Col>
					<Row className="mt-2">
						{/** This outlet comes from react-router-dom for nested routes
				 * - HikerPreferences
				 * - Active Hikes
				 * - Completed Hikes
				 */}
						<Outlet />
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default HikerProfile;
