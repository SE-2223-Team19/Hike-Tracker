import { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Difficulty } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import { Formik } from "formik";
import * as Yup from "yup";
import { getLocations } from "../api/locations";
import { createHike } from "../api/hikes";
import GpxParser from "gpxparser";

function DescribeHikeForm() {
	const [locations, setLocations] = useState([]);

	// ** Data fetching
	useEffect(() => {
		const fetchLocations = async () => {
			const locations = await getLocations();
			setLocations(locations.filter((location) => location.locationType !== "default")); // TODO: Filter on api query
		};
		fetchLocations();
	}, []);

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
		};
		fileReader.readAsText(file);
	};

	// ** On submit
	const handleSubmit = async (values) => {
		// Remeber to format point into array before sending to api
		console.log(values);
		await createHike(values);
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
		startPointId: Yup.string(),
		startPointLat: Yup.number().min(-90).max(90).required("Required").typeError("Must be a number"),
		startPointLng: Yup.number()
			.min(-180)
			.max(180)
			.required("Required")
			.typeError("Must be a number"),
		endPointId: Yup.string(),
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
				startPoint: [],
				endPoint: [],
				referencePoints: [],
				gpxFile: null,
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
									onChange={(e) => onGpxFileUpload(e.target.files[0], setFieldValue)}
									onBlur={handleBlur}
									isInvalid={!!errors.gpxFile}
									accept={".gpx,application/gpx+xml"}
								/>
								<Form.Control.Feedback type="invalid">{errors.gpxFile}</Form.Control.Feedback>
							</Form.Group>
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
