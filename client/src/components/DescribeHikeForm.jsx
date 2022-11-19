import { Form, Button, Row, Col, Stack } from "react-bootstrap";
import { Difficulty } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import { Formik } from "formik";
import * as Yup from "yup";
import GpxParser from "gpxparser";
import PointSelector from "./PointSelector";
import { createHike } from "../api/hikes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function DescribeHikeForm() {
	const navigate = useNavigate();

	const onGpxFileUpload = (file, setFieldValue, extract) => {
		setFieldValue("gpxFile", file);
		const fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			const gpx = new GpxParser();
			gpx.parse(fileReader.result);
			setFieldValue("length", gpx.tracks[0].distance.total);
			setFieldValue("title", gpx.tracks[0].name);
			setFieldValue("ascent", gpx.tracks[0].elevation.max - gpx.tracks[0].elevation.min);
			setFieldValue("description", gpx.tracks[0].desc);
			setFieldValue(
				"trackPoints",
				gpx.tracks[0].points.map((p) => [p.lat, p.lon])
			);
			if (extract) {
				setFieldValue("startPoint", {
					point: {
						lat: gpx.tracks[0].points[0].lat,
						lng: gpx.tracks[0].points[0].lon,
					},
					locationType: "default",
				});
				setFieldValue("endPoint", {
					point: {
						lat: gpx.tracks[0].points[gpx.tracks[0].points.length - 1].lat,
						lng: gpx.tracks[0].points[gpx.tracks[0].points.length - 1].lon,
					},
					locationType: "default",
				});
			}
		};
		fileReader.readAsText(file);
	};

	// ** On submit
	const handleSubmit = async (values) => {
		// Format points for backend
		delete values.extractPoints;
		delete values.gpxFile;
		console.log(values.referencePoints);
		const createdHike = await createHike({ ...values });
		if (createdHike) toast.success("Hike created successfully");
		else toast.error("Error creating hike " + createdHike);
		navigate("/");
	};

	// ** Form validation
	const locationSchema = Yup.object().shape({
		_id: Yup.string().nullable(),
		locationType: Yup.string().required("Required"),
		point: Yup.object()
			.shape({
				lat: Yup.number().required("Required"),
				lng: Yup.number().required("Required"),
			})
			.required("Required"),
	});

	const validationSchema = Yup.object().shape({
		title: Yup.string().required("Required"),
		length: Yup.number().required("Required"),
		ascent: Yup.number().required("Required"),
		expectedTime: Yup.number().required("Required"),
		difficulty: Yup.string().required("Required"),
		description: Yup.string("Required").typeError("Required").required("Required"),
		gpxFile: Yup.mixed().required("Required"),
		extractPoints: Yup.boolean(),
		startPoint: locationSchema.typeError("Type Error").required("Required"),
		endPoint: locationSchema.typeError("Type Error").required("Required"),
		referencePoints: Yup.array()
			.of(locationSchema.typeError("Type error").required("Required"))
			.required("Required"),
		trackPoints: Yup.array()
			.of(Yup.array().of(Yup.number()).required("Required"))
			.required("Required"),
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
				startPoint: "null",
				endPoint: "null",
				referencePoints: [],
				gpxFile: null,
				extractPoints: false,
				trackPoints: [],
			}}
			onSubmit={async (values, { setSubmitting }) => {
				setSubmitting(true);
				await handleSubmit(values);
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
								<Form.Label>Length (in meters)</Form.Label>
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
								<Form.Label>Ascent (in meters)</Form.Label>
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
								<Form.Label>Expected time (in minutes)</Form.Label>
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
									value={values.difficulty || ""}
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
									value={values.description || ""}
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
								<Stack
									direction="horizontal"
									className="align-items-center justify-content-between"
								>
									<Form.Label>Load GPX File</Form.Label>
									<Form.Check
										type="checkbox"
										defaultChecked={false}
										name="extractPoints"
										value={values.extractPoints}
										onChange={handleChange}
										label="Extract Start Point/End Point"
									/>
								</Stack>
								<Form.Control
									type="file"
									name="gpxFile"
									onChange={(e) =>
										onGpxFileUpload(e.target.files[0], setFieldValue, values.extractPoints)
									}
									onBlur={handleBlur}
									isInvalid={!!errors.gpxFile}
									accept={".gpx,application/gpx+xml"}
								/>
								<Form.Control.Feedback type="invalid">{errors.gpxFile}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						{/** Start Point */}
						<Col xs={12} md={6}>
							<Form.Group controlId="startPoint" className="mt-4">
								<Form.Label>
									Start Point{" "}
									{values.startPoint?.point
										? `- Lat: ${values.startPoint.point.lat} Long: ${values.startPoint.point.lng}`
										: ""}
								</Form.Label>
								<PointSelector
									name="startPoint"
									value={values.startPoint || ""}
									isInvalid={!!errors.startPoint}
									handleChange={(location) => {
										setFieldValue("startPoint", {
											point: {
												lat: location.point[1],
												lng: location.point[0],
											},
											locationType: location.locationType,
											_id: location._id,
										});
									}}
								/>
								<Form.Control.Feedback type="invalid">{errors.startPoint}</Form.Control.Feedback>
							</Form.Group>
						</Col>
						{/** End Point */}
						<Col xs={12} md={6}>
							<Form.Group controlId="endPoint" className="mt-4">
								<Form.Label>
									End Point{" "}
									{values.endPoint?.point
										? `- Lat: ${values.endPoint.point.lat} Long: ${values.endPoint.point.lng}`
										: ""}
								</Form.Label>
								<PointSelector
									name="endPoint"
									value={values.endPoint}
									isInvalid={!!errors.endPoint}
									handleChange={(location) => {
										setFieldValue("endPoint", {
											point: {
												lat: location.point[1],
												lng: location.point[0],
											},
											locationType: location.locationType,
											_id: location._id,
										});
									}}
								/>
								<Form.Control.Feedback type="invalid">{errors.startPoint}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					{/** Reference Points */}
					<Row>
						<Col xs={12}>
							<Form.Group controlId="referencePoints" className="mt-4">
								<Form.Label>Reference Points</Form.Label>
								<ol>
									{values.referencePoints.map((point, index) => (
										<li key={index}>{`Lat: ${point.point.lat} Long: ${point.point.lng}`}</li>
									))}
								</ol>
								<PointSelector
									name="referencePoints"
									value={values.referencePoints}
									multiple
									isInvalid={!!errors.referencePoints}
									handleChange={(location) => {
										setFieldValue("referencePoints", [
											...values.referencePoints,
											{
												point: {
													lat: location.point[1],
													lng: location.point[0],
												},
												locationType: location.locationType,
												_id: location._id,
											},
										]);
									}}
								/>
								<Form.Control.Feedback type="invalid">{errors.startPoint}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Button
						type="submit"
						onClick={handleSubmit}
						variant="success"
						className="mt-4"
						disabled={isSubmitting}
					>
						Create
					</Button>
				</Form>
			)}
		</Formik>
	);
}

export default DescribeHikeForm;
