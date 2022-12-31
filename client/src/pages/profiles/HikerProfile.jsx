import React, { useState } from "react";
import { Badge, Col, Row, Tabs, Tab } from "react-bootstrap";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import HikerPreferences from "./HikerPreferences";
import { HikerActiveHikes, HikerTerminetedHikes, HikerPlannedHikes } from "./HikerRegisteredHikes";
import "./HikerProfile.css";
import HikerStatistics from "./HikerStatistics";

const HikerProfile = ({ user }) => {
	const [key, setKey] = useState("statistics");

	return (
		<>
			<div>
				<Row>
					<Col xs={12} md={3}>
						<h5>{user.fullName} (Nome Cognome)</h5>
						<p>{user.email} (Email)</p>
						<Badge bg="success">{capitalizeAndReplaceUnderscores(user.userType)} (user type)</Badge>
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Tabs
						id="controlled-tab-example"
						className="mb-3"
						activeKey={key}
						onSelect={(k) => setKey(k)}
						unmountOnExit={true}
						justify
					>
						<Tab eventKey="statistics" title="Statistics" enabled>
							<HikerStatistics />
						</Tab>
						<Tab eventKey="preferences" title="Preferences">
							<HikerPreferences key={key} />
						</Tab>
						<Tab eventKey="planned hikes" title="Planned hikes">
							<HikerPlannedHikes key={key} />
						</Tab>
						<Tab eventKey="active hikes" title="Active hikes">
							<HikerActiveHikes key={key} />
						</Tab>
						<Tab eventKey="terminated hikes" title="Terminated hikes">
							<HikerTerminetedHikes key={key} />
						</Tab>
					</Tabs>
				</Row>
			</div>

		</>
	);
};

export default HikerProfile;
