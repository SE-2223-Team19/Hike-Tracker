import { React, useContext, useEffect } from "react";
import { Difficulty, UserType, LocationType } from "../../helper/enums";
import {
	Form,
	Button,
	Row,
	Col,
	Container,
	ListGroup,
	ListGroupItem,
	CloseButton,
	Stack,
} from "react-bootstrap";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import { Formik } from "formik";
import * as Yup from "yup";
import GpxParser from "gpxparser";
import PointSelector from "../PointSelector";
import { createHike, updateHike } from "../../api/hikes";
import { useNavigate } from "react-router-dom";
import SelectReferencePointsMap from "../SelectReferencePointsMap";
import { AuthContext } from "../../context/AuthContext";

function DescribeHikeForm({ hike }) {
	const navigate = useNavigate();

	const { user, setMessage } = useContext(AuthContext);

	useEffect(() => {
		if (user === null || user.userType !== UserType.LOCAL_GUIDE) {
			navigate("/");
		}
	}, [user, navigate]);

	const onGpxFileUpload = (file, setFieldValue) => {
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
			setFieldValue(
				"expectedTime",
				Math.floor(
					(gpx.tracks[0].points[gpx.tracks[0].points.length - 1].time -
						gpx.tracks[0].points[0].time) /
						60000
				)
			);
			setFieldValue(
				"ascent",
				Math.round(
					gpx.tracks[0].points
						.map((p) => p.ele)
						.reduce(
							(p, c) => ({
								ascent: p.ascent + (c - p.lastElevation),
								lastElevation: c,
							}),
							{
								ascent: 0,
								lastElevation: gpx.tracks[0].points[0].ele,
							}
						).ascent * 100
				) / 100
			);
			setFieldValue("startPoint", {
				locationType: "default",
				point: {
					lat: gpx.tracks[0].points[0].lat,
					lng: gpx.tracks[0].points[0].lon,
				},
			});
			setFieldValue("endPoint", {
				locationType: "default",
				point: {
					lat: gpx.tracks[0].points[gpx.tracks[0].points.length - 1].lat,
					lng: gpx.tracks[0].points[gpx.tracks[0].points.length - 1].lon,
				},
			});
		};
		fileReader.readAsText(file);
	};

	// ** On submit
	const handleSubmit = async (values) => {
		console.log(values);
		// Format points for backend
		delete values.gpxFile;
		delete values.extractPoints;
		if (values.startPoint === "") {
			values.startPoint = null;
		}
		if (values.endPoint) {
			values.endPoint = values.endPoint._id;
		}
		console.log("on submit", values);
		if (values.linkedHuts && values.linkedHuts.length > 0) {
			values.linkedHuts = values.linkedHuts.map((hut) => hut._id);
		}
		if (hike) {
			// Update hike
			delete values.trackPoints;
			delete values.referencePoints;
			delete values.startPoint;
			delete values.endPoint;
			const updatedHike = await updateHike(hike._id, { ...values });
			console.log(updatedHike);
			if (updatedHike._id) {
				return navigate("/profile");
			}
			setMessage({
				type: "danger",
				msg: "Error updating hike",
			});
			return;
		}
		const createdHike = await createHike({ ...values });
		if (createdHike._id) {
			return navigate("/profile");
		}
		setMessage({
			type: "danger",
			msg: "Error creating hike",
		});
	};

	// ** Form validation
	const locationSchema = Yup.object().shape({
		_id: Yup.string().nullable(),
		locationType: Yup.string(),
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
		gpxFile: !hike && Yup.mixed().required("Required"),
		startPoint: !hike && locationSchema.nullable(true).typeError("Type Error"),
		endPoint: !hike && locationSchema.nullable(true).typeError("Type Error"),
		linkedHuts: !hike && Yup.array().of(locationSchema).required("Required"),
		referencePoints:
			!hike &&
			Yup.array().of(Yup.array().of(Yup.number()).required("Required")).required("Required"),
		trackPoints:
			!hike &&
			Yup.array().of(Yup.array().of(Yup.number()).required("Required")).required("Required"),
	});

	const formatPoint = (pointFromMongo) => {
		return {
			...pointFromMongo,
			point: {
				lat: pointFromMongo.point[1],
				lng: pointFromMongo.point[0],
			},
		};
	};

	/** Initial Values */
	const getInitialTitle = () => (hike ? hike.title : "");
	const getInitialLength = () => (hike ? hike.length : "");
	const getInitialAscent = () => (hike ? hike.ascent : "");
	const getInitialExpectedTime = () => (hike ? hike.expectedTime : "");
	const getInitialDifficulty = () => (hike ? hike.difficulty : "");
	const getInitialDescription = () => (hike ? hike.description : "");
	const getInitialStartPoint = () => (hike ? formatPoint(hike.startPoint) : "");
	const getInitialEndPoint = () => (hike ? formatPoint(hike.endPoint) : "");
	const getInitialReferencePoints = () => (hike ? hike.referencePoints : []);
	const getInitialLinkedHuts = () => (hike ? hike.linkedHuts.map(formatPoint) : []);

	// ** Render
	return (
		<Formik
			initialValues={{
				title: getInitialTitle(),
				length: getInitialLength(),
				ascent: getInitialAscent(),
				expectedTime: getInitialExpectedTime(),
				difficulty: getInitialDifficulty(),
				description: getInitialDescription(),
				startPoint: getInitialStartPoint(),
				endPoint: getInitialEndPoint(),
				referencePoints: getInitialReferencePoints(),
				gpxFile: null,
				trackPoints: [],
				linkedHuts: getInitialLinkedHuts(),
			}}
			onSubmit={async (values, { setSubmitting }) => {
				setSubmitting(true);
				await handleSubmit({ ...values });
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
					{!hike && (
						<Row>
							<Col xs={12}>
								<Form.Group controlId="gpxFile" className="mt-4">
									<Stack
										direction="horizontal"
										className="align-items-center justify-content-between"
									>
										<Form.Label>Load GPX File</Form.Label>
										<Form.Check
											data-test-id="extract-points-from-gpx"
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
										data-test-id="gpx-file-uploader"
										onChange={(e) => onGpxFileUpload(e.target.files[0], setFieldValue)}
										onBlur={handleBlur}
										isInvalid={!!errors.gpxFile}
										accept={".gpx,application/gpx+xml"}
									/>
									<Form.Control.Feedback type="invalid">{errors.gpxFile}</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>
					)}
					{!hike && (
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
										value={values.startPoint && values.startPoint._id}
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
									<Form.Control.Feedback type="invalid">Invalid start point</Form.Control.Feedback>
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
										value={values.endPoint && values.endPoint._id}
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
									<Form.Control.Feedback type="invalid">Invalid end point</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>
					)}
					{/** Reference Points */}
					{!hike && (
						<Row>
							<Col xs={12}>
								<Form.Group controlId="referencePoints" className="mt-4">
									<Form.Label>Reference Points</Form.Label>
									<Container>
										<Row>
											<Col style={{ height: "50vh" }}>
												<SelectReferencePointsMap
													referencePoints={values.referencePoints}
													setReferencePoints={(r) => {
														setFieldValue("referencePoints", r);
													}}
													trackPoints={values.trackPoints}
												/>
											</Col>
										</Row>
									</Container>
									<Form.Control.Feedback type="invalid">
										Invalid reference points
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>
					)}
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Linked Huts</Form.Label>
								<ListGroup as="ol" className="mb-3">
									{values.linkedHuts.map((point) => (
										<ListGroupItem key={point._id} className="d-flex justify-content-between">
											<span>
												{point.description} (Lat: {point.point.lat} Long: {point.point.lng})
											</span>
											<CloseButton
												onClick={() => {
													setFieldValue(
														"referencePoints",
														values.referencePoints.filter((p) => p._id !== point._id)
													);
												}}
											/>
										</ListGroupItem>
									))}
								</ListGroup>
								<PointSelector
									name="linkedHuts"
									value={values.linkedHuts.map((p) => p._id)}
									multiple
									handleChange={(location) => {
										if (!values.linkedHuts.some((p) => p._id === location._id)) {
											setFieldValue("linkedHuts", [
												...values.linkedHuts,
												{
													point: {
														lat: location.point[1],
														lng: location.point[0],
													},
													locationType: location.locationType,
													_id: location._id,
													description: location.description,
												},
											]);
										}
									}}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Button
						type="submit"
						onClick={handleSubmit}
						variant="success"
						className="mt-4 justify-self-end"
						disabled={isSubmitting}
					>
						{hike ? "Update" : "Create"}
					</Button>
				</Form>
			)}
		</Formik>
	);
}

export default DescribeHikeForm;
