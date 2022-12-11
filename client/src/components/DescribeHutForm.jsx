import { createLocation } from "../api/locations";
import { useEffect, useState, useContext } from "react";
import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { LocationType } from "../helper/enums";
import PositionSelectorModal from "./PositionSelectorModal";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

function DescribeHutForm() {
	const navigate = useNavigate();
	const { setMessage } = useContext(AuthContext);

	const [showModal, setShowModal] = useState(false);

	async function handleSubmit(values) {
		values.locationType = LocationType.HUT;
		values.point = [values.pointLng, values.pointLat];
		delete values.pointLat;
		delete values.pointLng;
		const hut = await createLocation(values);
		if (hut && !hut.err) {
			setMessage(false);
			navigate("/huts");
		} else {
			setMessage({
				type: "danger",
				msg: hut.err
			});
		}
	}

	const validationSchema = Yup.object().shape({
		description: Yup.string().required("Required"),
		pointLat: Yup.number().min(-90).max(90).required("Required"),
		pointLng: Yup.number().min(-180).max(180).required("Required"),
		name: Yup.string().required("Required"),
		altitude: Yup.number().integer().required("Required"),
		numberOfBeds: Yup.number().integer().positive().required("Required"),
		email: Yup.string().email().required("Required"),
		phone: Yup.string().required("Required"),
		webSite: Yup.string().url()
	});

	return (
		<Formik
			initialValues={{
				description: "",
				pointLat: "",
				pointLng: "",
				name: "",
				altitude: "",
				numberOfBeds: "",
				email: "",
				phone: "",
				webSite: ""
			}}
			onSubmit={async (values, { setSubmitting }) => {
				setSubmitting(true);
				await handleSubmit({ ...values});
				setSubmitting(false);
			}}
			validationSchema={validationSchema}
			validateOnChange={false}
			validateOnBlur={false}
			validateOnMount={false}
		>
			{
				function ShowForm({
					values,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
					errors,
					touched,
					setFieldValue,
					validateField,
				}) {

					useEffect(() => {
						async function getAltitude() {
							if (values && values.pointLat !== "" && values.pointLng !== "" && values.pointLat !== undefined && values.pointLng !== undefined) {
								const url = new URL("https://api.open-elevation.com/api/v1/lookup");
								url.searchParams.append("locations", `${values.pointLat},${values.pointLng}`);
								const res = await fetch(url);
								if (res.ok) {
									const body = await res.json();
									if (body.results && body.results.length === 1) {
										setFieldValue("altitude", body.results[0].elevation);
									}
								}
							}
						}
						getAltitude();
					}, [values.pointLat, values.pointLng, setFieldValue]);

					return (
						<Form onSubmit={handleSubmit}>
							<Row>
								<Col xs={12} md={4}>
									<Form.Group controlId="latitude" className="mt-3">
										<Form.Label>Latitude Point</Form.Label>
										<Form.Control
											type="number"
											name="latitude"
											value={values.pointLat}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.pointLat}
										/>
										<Form.Control.Feedback type="invalid">{errors.pointLat}</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col xs={12} md={4}>
									<Form.Group controlId="longitude" className="mt-3">
										<Form.Label>Longitude Point</Form.Label>
										<Form.Control
											type="number"
											name="longitude"
											value={values.pointLng}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.pointLng}
										/>
										<Form.Control.Feedback type="invalid">{errors.pointLng}</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col xs={12} md={4}>
									<Form.Group controlId="altitude" className="mt-3">
										<Form.Label>Altitude (m.a.s.l.)</Form.Label>
										<Form.Control
											type="number"
											name="altitude"
											value={values.altitude}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.altitude}
										/>
										<Form.Control.Feedback type="invalid">{errors.altitude}</Form.Control.Feedback>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col xs={12} md={12}>
									<Form.Group controlId="name" className="mt-3">
										<Form.Label>Name</Form.Label>
										<Form.Control
											type="text"
											name="name"
											value={values.name}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.name}
										/>
										<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col xs={12} md={12}>
									<Form.Group controlId="description" className="mt-3">
										<Form.Label>Description</Form.Label>
										<Form.Control
											type="text"
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
								<Col>
									<Form.Group controlId="numberOfBeds" className="mt-3">
										<Form.Label>Number of beds</Form.Label>
										<Form.Control
											type="number"
											name="numberOfBeds"
											value={values.numberOfBeds}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.numberOfBeds}
										/>
										<Form.Control.Feedback type="invalid">{errors.numberOfBeds}</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="phone" className="mt-3">
										<Form.Label>Phone</Form.Label>
										<Form.Control
											type="tel"
											name="phone"
											value={values.phone}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.phone}
										/>
										<Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="email" className="mt-3">
										<Form.Label>Email</Form.Label>
										<Form.Control
											type="email"
											name="email"
											value={values.email}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.email}
										/>
										<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="webSite" className="mt-3">
										<Form.Label>Web site</Form.Label>
										<Form.Control
											type="url"
											name="webSite"
											value={values.webSite}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.webSite}
										/>
										<Form.Control.Feedback type="invalid">{errors.webSite}</Form.Control.Feedback>
									</Form.Group>
								</Col>
							</Row>
							<Stack direction="horizontal" className="mt-4" gap={3}>
								<Button variant="success" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
									Create
								</Button>
								<Button variant="outline-success" onClick={() => setShowModal(true)} disabled={isSubmitting}>
									Select from map
								</Button>
							</Stack>
							<PositionSelectorModal
								show={showModal}
								setShow={setShowModal}
								onCancel={() => setShowModal(false)}
								onOk={(coordinates) => {
									setFieldValue("pointLat", coordinates[0]);
									setFieldValue("pointLng", coordinates[1]);
									setShowModal(false);
								}}
							/>
						</Form>
					);
				}
			}
		</Formik>
	);
}

export default DescribeHutForm;
