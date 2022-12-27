import { Button, Form, Modal } from "react-bootstrap";
import { React } from "react";
import { updateLocation } from "../api/locations";
import { LocationType } from "../helper/enums";
import { Formik } from "formik";
import * as Yup from "yup";

function ModelFormHut({ currentHut, show, setShow, setDirty }) {

	
	const onSaveModifiedHut = async (values) => {
		await updateLocation(currentHut._id, {
			name: values.name,
			description: values.description,
			numberOfBeds: values.numberOfBeds,
			email: values.email,
			phone: values.phone,
			webSite: values.webSite,
			locationType: LocationType.HUT
		});
		
		setShow(false);
		setDirty(true)
	}

	const validationSchema = Yup.object().shape({
		description: Yup.string().required("Required"),
		name: Yup.string().required("Required"),
		phone: Yup.string().required("Required"),
		email: Yup.string().email().required("Required"),
		webSite: Yup.string(),
		numberOfBeds: Yup.number().required("Required"),
	});

	return <Modal show={show} >
		<Modal.Header>
			<Modal.Title>Modify Hut</Modal.Title>
		</Modal.Header>
		<Formik
			initialValues={{
				description: currentHut ? currentHut.description : "",
				name: currentHut ? currentHut.name : "",
				phone: currentHut ? currentHut.phone : "",
				email: currentHut ? currentHut.email : "",
				webSite: currentHut ? currentHut.webSite : "",
				numberOfBeds: currentHut ? currentHut.numberOfBeds : ""
			}}
			onSubmit={
				async (values, { setSubmitting }) => {
				setSubmitting(true)
				await onSaveModifiedHut(values);
				setSubmitting(false)
			}
		}
			validationSchema={validationSchema}
			validateOnChange={true}
			validateOnBlur={false}
			validateOnMount={false}
		>
			{({
				values,
				handleChange,
				handleBlur,
				handleSubmit,
				errors,
				isSubmitting
			}) => {
				return (<Form onSubmit={handleSubmit} noValidate>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Description</Form.Label>
							<Form.Control
								data-test-id = "descriptionHut"
								value={values.description}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={!!errors.description}
								as="textarea" 
								name="description"
							/>
							<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>Name</Form.Label>
							<Form.Control
								value={values.name}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={!!errors.name}
								type="text"
								name="name"
							/>
							<Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>phone</Form.Label>
							<Form.Control
								value={values.phone}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={!!errors.phone}
								type="text"
								name="phone"
							/>
							<Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>email</Form.Label>
							<Form.Control
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={!!errors.email}
								type="text"
								name="email"
							/>
							<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>web site</Form.Label>
							<Form.Control
								value={values.webSite}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={!!errors.webSite}
								type="text"
								name="webSite"
							/>
							<Form.Control.Feedback type="invalid">{errors.webSite}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<Form.Label>Number Of Beds</Form.Label>
							<Form.Control
								value={values.numberOfBeds}
								onChange={handleChange}
								onBlur={handleBlur}
								isInvalid={!!errors.numberOfBeds}
								type="number"
								name="numberOfBeds"
							/>
							<Form.Control.Feedback type="invalid">{errors.numberOfBeds}</Form.Control.Feedback>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="danger" onClick={() => setShow(false)}>
							Close
						</Button>
						<Button type="submit"
							variant="success"
							disabled={isSubmitting}>
							Save
						</Button>
					</Modal.Footer>
				</Form>
				);
			}}
		</Formik>
	</Modal >
}

export default ModelFormHut