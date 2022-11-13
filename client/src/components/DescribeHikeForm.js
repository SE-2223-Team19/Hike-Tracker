import { useState } from "react";
import { Form, Button, Row, Col, Stack } from "react-bootstrap";
import { Difficulty } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";

function DescribeHikeForm({ createHike }) {
	const [title, setTitle] = useState("");
	const [length, setLength] = useState("");
	const [ascent, setAscent] = useState("");
	const [expectedTime, setExpectedTime] = useState("");
	const [difficulty, setDifficulty] = useState("");
	const [description, setDescription] = useState("");
	const [startPoint, setStartPoint] = useState(Array(2).fill(""));
	const [endPoint, setEndPoint] = useState(Array(2).fill(""));
	const [referencePoints, setReferencePoints] = useState(Array(1).fill(Array(2).fill("")));

	const handlesubmit = (event) => {
		event.perventDefault();
		createHike({
			title,
			length,
			ascent,
			expectedTime,
			difficulty,
			description,
			startPoint,
			endPoint,
			referencePoints,
		});
	};

	return (
		<Form onSubmit={handlesubmit}>
			<Row>
				<Col xs={12} md={4}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="Title">Title</Form.Label>
						<Form.Control
							type="string"
							id="Title"
							placeholder="Title"
							onChange={(event) => {
								setTitle(event.target.value);
							}}
						/>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="length">Length</Form.Label>
						<Form.Control
							type="number"
							id="length"
							placeholder="Length"
							onChange={(event) => {
								setLength(event.target.value);
							}}
						/>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="ascent">Ascent</Form.Label>
						<Form.Control
							type="number"
							id="ascent"
							placeholder="Ascent"
							onChange={(event) => {
								setAscent(event.target.value);
							}}
						/>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col xs={12} md={6}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="expectedTime">Expected Time</Form.Label>
						<Form.Control
							type="number"
							id="expectedTime"
							placeholder="Expected Time (in minutes)"
							onChange={(event) => {
								setExpectedTime(event.target.value);
							}}
						/>
					</Form.Group>
				</Col>
				<Col xs={12} md={6}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="difficulty">Difficulty</Form.Label>
						<Form.Select
							id="difficulty"
							placeholder="Difficulty"
							onChange={(event) => {
								setDifficulty(event.target.value);
							}}
						>
							{Object.values(Difficulty).map((difficulty) => {
								return (
									<option key={difficulty} value={difficulty}>
										{capitalizeAndReplaceUnderscores(difficulty)}
									</option>
								);
							})}
						</Form.Select>
					</Form.Group>
				</Col>
			</Row>
			<Form.Group className="mb-3">
				<Form.Label htmlFor="description">Description</Form.Label>
				<Form.Control
					type="string"
					id="description"
					as={"textarea"}
					rows={3}
					placeholder="Description"
					onChange={(event) => {
						setDescription(event.target.value);
					}}
				/>
			</Form.Group>
			<Row>
				<Col xs={12} md={6}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="startPoint">Start Point</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								placeholder="Lat"
								onChange={(event) => {
									setStartPoint([event.target.value, startPoint[1]]);
								}}
							/>
							<Form.Control
								placeholder="Long"
								onChange={(event) => {
									setStartPoint([startPoint[0], event.target.value]);
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
				<Col xs={12} md={6}>
					<Form.Group className="mb-3">
						<Form.Label htmlFor="endPoint">End Point</Form.Label>
						<Stack direction="horizontal" gap={2}>
							<Form.Control
								placeholder="Lat"
								onChange={(event) => {
									setEndPoint([event.target.value, endPoint[1]]);
								}}
							/>
							<Form.Control
								placeholder="Long"
								onChange={(event) => {
									setEndPoint([endPoint[0], event.target.value]);
								}}
							/>
						</Stack>
					</Form.Group>
				</Col>
			</Row>
			<Form.Group className="mb-3">
				<Form.Label htmlFor="referencePoints">Reference Points</Form.Label>
				<Form.Control
					type="string"
					id="referencePoints"
					placeholder="referencePoints"
					onChange={(event) => {
						setReferencePoints(event.target.value);
					}}
				/>
			</Form.Group>
			<Button type="submit" variant="success" size="lg">
				Submit
			</Button>
			<Button variant="secondary" size="lg">
				Cancel
			</Button>
		</Form>
	);
}

export default DescribeHikeForm;
