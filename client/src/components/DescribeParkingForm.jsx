import { createLocation } from "../api/locations";
import { useState } from "react";
import { Form, Row, Col, Button, Stack } from "react-bootstrap";
import { LocationType } from "../helper/enums";
import PositionSelectorModal from "./PositionSelectorModal";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

function DescribeParkingForm() {
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	async function handleSubmit(values) {
		let data = {
			locationType: LocationType.PARKING_LOT,
			description: values.description,
			point: [values.pointLng, values.pointLat],
			name: values.name,
			capacity: values.capacity
		};

		const parkingLot = await createLocation(data);
		if (parkingLot) {
			navigate("/parking-lots");
		}
	}

	const validationSchema = Yup.object().shape({
		description: Yup.string().required("Required"),
		pointLat: Yup.number().min(-90).max(90).required("Required"),
		pointLng: Yup.number().min(-180).max(180).required("Required"),
		name: Yup.string().required("Required"),
		capacity: Yup.number().integer().required("Required")
	});

	return (
		<Formik
			initialValues={{
				description: "",
				pointLat: null,
				pointLng: null,
				name: "",
				capacity: null
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
			{
				({
					values,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
					errors,
					touched,
					setFieldValue,
					validateField,
				}) => {

					return (
						<Form onSubmit={handleSubmit}>
							<Row>
								<Col xs={12} md={6}>
									<Form.Group controlId="pointLat" className="mt-3">
										<Form.Label>Latitude Point</Form.Label>
										<Form.Control
											type="number"
											name="pointLat"
											value={values.pointLat}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.pointLat}
										/>
										<Form.Control.Feedback type="invalid">{errors.pointLat}</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col xs={12} md={6}>
									<Form.Group controlId="pointLng" className="mt-3">
										<Form.Label>Longitude Point</Form.Label>
										<Form.Control
											type="number"
											name="pointLng"
											value={values.pointLng}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.pointLng}
										/>
										<Form.Control.Feedback type="invalid">{errors.pointLng}</Form.Control.Feedback>
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
									<Form.Group controlId="capacity" className="mt-3">
										<Form.Label>Capacity</Form.Label>
										<Form.Control
											type="number"
											name="capacity"
											value={values.capacity}
											onChange={handleChange}
											onBlur={handleBlur}
											isInvalid={!!errors.capacity}
										/>
										<Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
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

export default DescribeParkingForm;
