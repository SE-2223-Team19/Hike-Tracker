import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Stack, ButtonGroup, ToggleButton } from "react-bootstrap";
import { Difficulty } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import AddPointForm from "./AddPointForm";
import AddReferencePointsForm from "./AddReferencePointsForm";
import { useFormik, Formik, validateYupSchema } from "formik";
import * as Yup from "yup";
import { getLocations } from "../api/locations";

function DescribeHikeForm({ createHike }) {
	// ** Form state
	// const [validated, setValidated] = useState(false);
	// const [title, setTitle] = useState("");
	// const [length, setLength] = useState("");
	// const [ascent, setAscent] = useState("");
	// const [expectedTime, setExpectedTime] = useState("");
	// const [difficulty, setDifficulty] = useState("");
	// const [description, setDescription] = useState("");
	// const [startPoint, setStartPoint] = useState([]); // Array of two elements: [lat, lng] (or [lng, lat] ?)
	// const [endPoint, setEndPoint] = useState([]); // Array of two elements: [lat, lng] (or [lng, lat] ?)
	// const [referencePoints, setReferencePoints] = useState([[1, 2]]); // Array of array of two elements: [lat, lng] (or [lng, lat] ?)

	const [addStartPointFromCoordinates, setAddStartPointFromCoordinates] = useState(false);
	const [addEndPointFromCoordinates, setAddEndPointFromCoordinates] = useState(false);
	const [referencePoints, setReferencePoints] = useState([]);
	const [locations, setLocations] = useState([]);

	// ** Data fetching
	useEffect(() => {
		const fetchLocations = async () => {
			const locations = await getLocations();
			setLocations(locations.filter((location) => location.locationType !== "default")); // TODO: Filter on api query
		};
		fetchLocations();
	}, []);

	// ** Reference Points Functions
	const addReferencePoint = (point) => {
		setReferencePoints([...referencePoints, point]);
	};

	const removeReferencePoint = (point) => {
		setReferencePoints(referencePoints.filter((p) => p !== point));
	};

	// ** On submit
	const handleSubmit = (values) => {
		// Remeber to format point into array before sending to api
		console.log(values);
	};

	// ** Form validation
	const validationSchema = Yup.object().shape({
		title: Yup.string().required("Required"),
		length: Yup.number().required("Required"),
		ascent: Yup.number().required("Required"),
		expectedTime: Yup.number().required("Required"),
		difficulty: Yup.string().required("Required"),
		description: Yup.string(),
		gpxFile: Yup.mixed(),
		startPointLat: Yup.number().min(-90).max(90).required("Required").typeError("Must be a number"),
		startPointLng: Yup.number()
			.min(-180)
			.max(180)
			.required("Required")
			.typeError("Must be a number"),
		endPointLat: Yup.number().min(-90).max(90).required("Required").typeError("Must be a number"),
		endPointLng: Yup.number().min(-180).max(180).required("Required").typeError("Must be a number"),
		referencePoints: Yup.array().of(Yup.array().of(Yup.number())),
	});

	// ** Render
	return (
		<Formik
			initialValues={{
				title: "",
				length: "",
				ascent: "",
				expectedTime: "",
				difficulty: "",
				description: "",
				startPointLat: "",
				startPointLng: "",
				endPointLat: "",
				endPointLng: "",
				referencePoints: [],
				gpxFile: null,
			}}
			onSubmit={(values, { setSubmitting }) => {
				setSubmitting(true);
				handleSubmit(values);
				setSubmitting(false);
			}}
			validationSchema={validationSchema}
			validateOnChange={false}
			validateOnBlur={false}
			validateOnMount={false}
		>
			{({
				values,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
				errors,
				touched,
				setFieldValue,
				validateField,
			}) => (
				<Form noValidate onSubmit={handleSubmit}>
					<Row>
						<Col xs={12} md={4}>
							<Form.Group controlId="title" className="mt-3">
								<Form.Label>Title</Form.Label>
								<Form.Control
									type="text"
									name="title"
									value={values.title}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.title}
								/>
								<Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="length" className="mt-3">
								<Form.Label>Length</Form.Label>
								<Form.Control
									type="number"
									name="length"
									value={values.length}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.length}
								/>
								<Form.Control.Feedback type="invalid">{errors.length}</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={4}>
							<Form.Group controlId="ascent" className="mt-3">
								<Form.Label>Ascent</Form.Label>
								<Form.Control
									type="number"
									name="ascent"
									value={values.ascent}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.ascent}
								/>
								<Form.Control.Feedback type="invalid">{errors.ascent}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={6}>
							<Form.Group controlId="expectedTime" className="mt-4">
								<Form.Label>Expected time</Form.Label>
								<Form.Control
									type="number"
									name="expectedTime"
									value={values.expectedTime}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.expectedTime}
								/>
								<Form.Control.Feedback type="invalid">{errors.expectedTime}</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col xs={12} md={6}>
							<Form.Group controlId="difficulty" className="mt-4">
								<Form.Label>Difficulty</Form.Label>
								<Form.Select
									as="select"
									name="difficulty"
									value={values.difficulty}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.difficulty}
								>
									<option value="">Select difficulty</option>
									{Object.values(Difficulty).map((difficulty) => (
										<option key={difficulty} value={difficulty}>
											{capitalizeAndReplaceUnderscores(difficulty)}
										</option>
									))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">{errors.difficulty}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<Form.Group controlId="description" className="mt-4">
								<Form.Label>Description</Form.Label>
								<Form.Control
									as="textarea"
									name="description"
									value={values.description}
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.description}
								/>
								<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							<Form.Group controlId="gpxFile" className="mt-4">
								<Form.Label>Load GPX File</Form.Label>
								<Form.Control
									type="file"
									name="gpxFile"
									onChange={handleChange}
									onBlur={handleBlur}
									isInvalid={!!errors.gpFile}
								/>
								<Form.Control.Feedback type="invalid">{errors.gpxFile}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						{/** Start Point */}
						<Col xs={12} md={6}>
							<Stack direction="horizontal" className="align-items-center justtify-content-between">
								<Form.Label className="mt-4">
									Start Point Lat: {values.startPointLat} Lng: {values.startPointLng}
								</Form.Label>
							</Stack>
							<Stack gap={3}>
								<ButtonGroup className="w-100">
									<ToggleButton
										id={`toggle-start-locations`}
										variant="outline-success"
										type="checkbox"
										name="radio"
										checked={!addStartPointFromCoordinates}
										value={false}
										onChange={() => setAddStartPointFromCoordinates(false)}
									>
										Choose from locations
									</ToggleButton>
									<ToggleButton
										id={`toggle-start-coordinates`}
										variant="outline-success"
										type="checkbox"
										name="radio"
										value={true}
										checked={addStartPointFromCoordinates}
										onChange={() => setAddStartPointFromCoordinates(true)}
									>
										Insert coordinates
									</ToggleButton>
								</ButtonGroup>
								{!addStartPointFromCoordinates && (
									<Stack direction="horizontal" gap={3} className="align-items-start">
										<Stack>
											<Form.Select
												placeholder="Choose from saved locations"
												name="startPoint"
												onChange={(e) => {
													if (!isNaN(e.target.value[0])) {
														const arrayPoint = e.target.value
															.split(",")
															.map((item) => parseFloat(item));
														console.log(arrayPoint);
														setFieldValue("startPointLat", arrayPoint[0]);
														setFieldValue("startPointLng", arrayPoint[1]);
													}
												}}
												onBlur={handleBlur}
												isInvalid={!!errors.startPointLat || !!errors.startPointLng}
												isValid={
													!errors.startPointLat &&
													touched.startPointLat &&
													!errors.startPointLng &&
													touched.startPointLng
												}
											>
												<option>Choose from saved locations</option>
												{locations.map((location) => (
													<option key={location._id} value={location.point}>
														{location.locationType}
													</option>
												))}
											</Form.Select>
											<Form.Control.Feedback type="invalid">Invalid point</Form.Control.Feedback>
										</Stack>
										<Button
											variant="success"
											type="button"
											onClick={() => {
												validateField("startPointLat");
												validateField("startPointLng");
											}}
										>
											Add
										</Button>
									</Stack>
								)}
								{addStartPointFromCoordinates && (
									<Stack gap={3}>
										<Stack direction="horizontal" gap={2}>
											<Form.Group>
												<Form.Control
													type="number"
													placeholder="Latitude"
													name="startPointLat"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={!!errors.startPointLat}
													isValid={!errors.startPointLat && touched.startPointLat}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.startPointLat}
												</Form.Control.Feedback>
											</Form.Group>

											<Form.Group>
												<Form.Control
													type="number"
													placeholder="Longitude"
													name="startPointLng"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={!!errors.startPointLng}
													isValid={!errors.startPointLng && touched.startPointLng}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.startPointLng}
												</Form.Control.Feedback>
											</Form.Group>
											<Button
												variant="success"
												onClick={() => {
													validateField("startPointLat");
													validateField("startPointLng");
												}}
											>
												Add
											</Button>
										</Stack>
									</Stack>
								)}
							</Stack>
						</Col>
						{/** End Point */}
						<Col xs={12} md={6}>
							<Stack direction="horizontal" className="align-items-center justtify-content-between">
								<Form.Label className="mt-4">
									End Point Lat: {values.endPointLat} Lng: {values.endPointLng}
								</Form.Label>
							</Stack>
							<Stack gap={3}>
								<ButtonGroup className="w-100">
									<ToggleButton
										id={`toggle-end-locations`}
										variant="outline-success"
										type="checkbox"
										name="radio"
										checked={!addEndPointFromCoordinates}
										value={false}
										onChange={() => setAddEndPointFromCoordinates(false)}
									>
										Choose from locations
									</ToggleButton>
									<ToggleButton
										id={`toggle-end-coordinates`}
										variant="outline-success"
										type="checkbox"
										name="radio"
										value={true}
										checked={addEndPointFromCoordinates}
										onChange={() => setAddEndPointFromCoordinates(true)}
									>
										Insert coordinates
									</ToggleButton>
								</ButtonGroup>
								{!addEndPointFromCoordinates && (
									<Stack direction="horizontal" gap={3} className="align-items-start">
										<Stack>
											<Form.Select
												placeholder="Choose from saved locations"
												name="endPoint"
												onChange={(e) => {
													if (!isNaN(e.target.value[0])) {
														const arrayPoint = e.target.value
															.split(",")
															.map((item) => parseFloat(item));
														console.log(arrayPoint);
														setFieldValue("endPointLat", arrayPoint[0]);
														setFieldValue("endPointLng", arrayPoint[1]);
													}
												}}
												onBlur={handleBlur}
												isInvalid={!!errors.endPointLat || !!errors.endPointLng}
												isValid={
													!errors.endPointLat &&
													touched.endPointLat &&
													!errors.endPointLng &&
													touched.endPointLng
												}
											>
												<option>Choose from saved locations</option>
												{locations.map((location) => (
													<option key={location._id} value={location.point}>
														{location.locationType}
													</option>
												))}
											</Form.Select>
											<Form.Control.Feedback type="invalid">Invalid point</Form.Control.Feedback>
										</Stack>
										<Button
											variant="success"
											type="button"
											onClick={() => {
												validateField("endPoint");
												validateField("endPointLng");
											}}
										>
											Add
										</Button>
									</Stack>
								)}
								{addEndPointFromCoordinates && (
									<Stack gap={3}>
										<Stack direction="horizontal" gap={2}>
											<Form.Group>
												<Form.Control
													type="number"
													placeholder="Latitude"
													name="endPointLat"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={!!errors.endPointLat}
													isValid={!errors.endPointLat && touched.endPointLat}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.endPointLat}
												</Form.Control.Feedback>
											</Form.Group>

											<Form.Group>
												<Form.Control
													type="number"
													placeholder="Longitude"
													name="endPointLng"
													onChange={handleChange}
													onBlur={handleBlur}
													isInvalid={!!errors.endPointLng}
													isValid={!errors.endPointLng && touched.endPointLng}
												/>
												<Form.Control.Feedback type="invalid">
													{errors.endPointLng}
												</Form.Control.Feedback>
											</Form.Group>
											<Button
												variant="success"
												onClick={() => {
													validateField("endPointLat");
													validateField("endPointLng");
												}}
											>
												Add
											</Button>
										</Stack>
									</Stack>
								)}
							</Stack>
						</Col>
					</Row>
					<Row>
						<Col>
							{/** Reference Points */}
							{/* <Form.Group className="mt-4">
								<Form.Label htmlFor="referencePoints">Reference Points</Form.Label>
								{/** Reference Points List */}
							{/* <ol className="mt-3">
									{referencePoints.map((point, index) => {
										return (
											<li key={index} className="mb-3">
												<Stack
													direction="horizontal"
													className="align-items-center justify-content-between"
												>
													<p>
														Lat: {point[0]}, Long: {point[1]}
													</p>
													<Button
														variant="outline-danger"
														onClick={() => removeReferencePoint(point)}
													>
														Remove
													</Button>
												</Stack>
											</li>
										);
									})}
								</ol> */}
							{/** Reference Points Add */}
							{/* </Form.Group> */}
						</Col>
					</Row>
					<Button type="submit" variant="success" className="mt-4" disabled={isSubmitting}>
						Create
					</Button>
				</Form>
			)}
		</Formik>
	);
}

export default DescribeHikeForm;
