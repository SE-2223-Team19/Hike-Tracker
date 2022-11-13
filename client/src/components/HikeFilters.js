import React from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { Difficulty } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";

const HikeFilters = ({ filters, setFilters }) => {
	/**
	 * Filters format
	 *
	 * minLength: Number,
	 * maxLength: Number,
	 * minAscent: Number,
	 * maxAscent: Number,
	 * minExpectedTime: Number,
	 * maxExpectedTime: Number,
	 * difficulty: String,
	 * location: [Number, Number], // [longitude, latitude]
	 */

	return (
		<Form>
			<Row className="mt-4">
				<Col xs={12} md={4}>
					<Form.Group>
						<Form.Label>Length (Km)</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="number"
								placeholder="Min"
								onChange={(event) => {
									setFilters({ ...filters, minLength: Number(event.target.value) });
								}}
							/>
							<Form.Control
								type="number"
								placeholder="Max"
								onChange={(event) => {
									setFilters({ ...filters, maxLength: Number(event.target.value) });
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group>
						<Form.Label>Ascent (m)</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="number"
								placeholder="Min"
								onChange={(event) => {
									setFilters({ ...filters, minAscent: Number(event.target.value) });
								}}
							/>
							<Form.Control
								type="number"
								placeholder="Max"
								onChange={(event) => {
									setFilters({ ...filters, maxAscent: Number(event.target.value) });
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group>
						<Form.Label>Expected Time (minutes)</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								type="number"
								placeholder="Min"
								onChange={(event) => {
									setFilters({ ...filters, minExpectedTime: Number(event.target.value) });
								}}
							/>
							<Form.Control
								type="number"
								placeholder="Max"
								onChange={(event) => {
									setFilters({ ...filters, maxExpectedTime: Number(event.target.value) });
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
			</Row>
			<Row className="mt-4">
				<Col>
					<Form.Group>
						<Form.Label>Difficulty</Form.Label>
						<Form.Select
							onChange={(event) => {
								setFilters({ ...filters, difficulty: event.target.value });
								if (event.target.value === "all") {
									delete filters.difficulty;
									setFilters({ ...filters });
								}
							}}
						>
							<option value="all">All</option>
							{Object.values(Difficulty).map((difficulty) => (
								<option key={difficulty} value={difficulty}>
									{capitalizeAndReplaceUnderscores(difficulty)}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Starting point</Form.Label>
						<Stack direction="horizontal" gap={2}>
							{/** TODO: Define how to pass lat and long */}
							{/* <Form.Control
								placeholder="Lat"
								onChange={(event) => {
									console.log(filters.location);
									setFilters({
										...filters,
										location: [Number(event.target.value), filters.location[1] || 0],
									});
								}}
							/>
							<Form.Control
								placeholder="Long"
								onChange={(event) => {
									console.log(filters.location);
									setFilters({
										...filters,
										location: [filters.location[0] || 0, Number(event.target.value)],
									});
								}}
							/> */}
						</Stack>
					</Form.Group>
				</Col>
			</Row>
		</Form>
	);
};

export default HikeFilters;
