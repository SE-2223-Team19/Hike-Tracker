import { React, useState, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { UserType } from "../../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";

const UserFilters = ({ filters, setFilters }) => {

	const [localFilters, setLocalFilters] = useState({});

	const submit = () => setFilters(localFilters);

	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	useEffect(() => {
		submit();
	}, [localFilters.userType]);

	return (
		<Row className="mt-4">
			<Col xs={12} md={4}>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						onChange={(e) => {
							if (e.target.value === "") {
								const {email, ...f} = localFilters;
								setLocalFilters(f);
							} else {
								setLocalFilters({ ...localFilters, email: e.target.value });
							}
						}}
						onBlur={submit}
					/>
				</Form.Group>
			</Col>
			<Col xs={12} md={4}>
				<Form.Group>
					<Form.Label>Full Name</Form.Label>
					<Form.Control
						type="text"
						onChange={(e) => {
							if (e.target.value === "") {
								const {fullName, ...f} = localFilters;
								setLocalFilters(f);
							} else {
								setLocalFilters({ ...localFilters, fullName: e.target.value });
							}
						}}
						onBlur={submit}
					/>
				</Form.Group>
			</Col>
			<Col xs={12} md={4}>
				<Form.Group>
					<Form.Label>User Type</Form.Label>
					<Form.Select
						onChange={(e) => {
							if (e.target.value === "") {
								const {userType, ...f} = localFilters;
								setLocalFilters(f);
							} else {
								setLocalFilters({ ...localFilters, userType: e.target.value });
							}
						}}
					>
						<option value="">Select a user type</option>
						{
							Object.values(UserType).map((userType) => (
								<option key={userType} value={userType}>
									{capitalizeAndReplaceUnderscores(userType)}
								</option>
							))
						}
					</Form.Select>
				</Form.Group>
			</Col>
		</Row>
	);
};

export default UserFilters;
