import React from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Difficulty } from "../../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";

const HikeFilters = ({ filters, setFilters, openModal }) => {
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
								data-test-id="min-length"
								type="number"
								min="0"
								placeholder="Min"
								value={filters.minLength}
								onChange={(event) => {
									setFilters({ ...filters, minLength: Number(event.target.value) });
								}}
							/>
							<Form.Control
								data-test-id="max-length"
								type="number"
								placeholder="Max"
								min="0"
								value={filters.maxLength}
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
								data-test-id="min-ascent"
								type="number"
								placeholder="Min"
								value={filters.minAscent}
								onChange={(event) => {
									setFilters({ ...filters, minAscent: Number(event.target.value) });
								}}
							/>
							<Form.Control
								data-test-id="max-ascent"
								type="number"
								placeholder="Max"
								value={filters.maxAscent}
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
								data-test-id="min-expected-time"
								type="number"
								min="0"
								placeholder="Min"
								value={filters.minExpectedTime}
								onChange={(event) => {
									setFilters({ ...filters, minExpectedTime: Number(event.target.value) });
								}}
							/>
							<Form.Control
								data-test-id="max-expected-time"
								type="number"
								min="0"
								placeholder="Max"
								value={filters.maxExpectedTime}
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
							data-test-id="difficulty"
							value={filters.difficulty}
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
					<Row>
						<Col>
							<Form.Label>Area</Form.Label>
							<Button
								data-test-id="select-area"
								onClick={openModal} variant={"success"} className="d-block">
								Select area
							</Button>
						</Col>
						<Col>
							<Form.Label>Latitude</Form.Label>
							<Form.Label className="d-block">{filters.locationCoordinatesLat}</Form.Label>
						</Col>
						<Col>
							<Form.Label>Longitude</Form.Label>
							<Form.Label className="d-block">{filters.locationCoordinatesLng}</Form.Label>
						</Col>
						<Col>
							<Form.Label>Radius (m)</Form.Label>
							<Form.Label className="d-block">{filters.locationRadius}</Form.Label>
						</Col>
					</Row>
				</Col>
			</Row>
		</Form>
	);
};

export default HikeFilters;
