import React, { useState } from "react";
import { Badge, Col, Row, Tabs, Tab } from "react-bootstrap";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import HikerPreferences from "./HikerPreferences";
import { HikerActiveHikes, HikerTerminetedHikes, HikerPlannedHikes } from "./HikerRegisteredHikes";

const HikerProfile = ({ user }) => {
	const [key, setKey] = useState("preferences");

	return (
		<>
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
				</Row>
				<Tabs
					id="controlled-tab-example"
					className="mb-3"
					activeKey={key}
					onSelect={(k) => setKey(k)}
					justify
				>
					<Tab eventKey="preferences" title="Preferences" enabled>
						<HikerPreferences />
					</Tab>
					<Tab eventKey="planned hikes" title="Planned hikes" enabled>
						<HikerPlannedHikes key={key} />
					</Tab>
					<Tab eventKey="active hikes" title="Active hikes">
						<HikerActiveHikes key={key} />
					</Tab>
					<Tab eventKey="terminated hikes" title="Terminated hikes">
						<HikerTerminetedHikes key={key} />
					</Tab>
				</Tabs>
			</div>

		</>
	);
};

export default HikerProfile;
