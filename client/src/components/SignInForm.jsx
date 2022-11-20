import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { UserType } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import { createUser } from "../api/users";

function SignInForm() {
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [userType, setUserType] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [errors, setErrors] = useState({
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
		userType: "",
		form: "",
	});

	const emailValidation = () => {
		const test = /\S+@\S+\.\S+/.test(email);
		setErrors({ ...errors, email: test ? "" : "Wrong format" });
		return test;
	};

	const confirmPasswordValidation = () => {
		const test = password === confirmPassword;
		setErrors({ ...errors, confirmPassword: test ? "" : "The passwords don't match" });
		return test;
	};

	const userTypeValidation = () => {
		const test = Object.values(UserType).some((t) => t === userType);
		setErrors({ ...errors, userType: test ? "" : "Unknown user type" });
		return test;
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		if ([emailValidation(), confirmPasswordValidation(), userTypeValidation()].every((a) => a)) {
			try {
				setErrors({ ...errors, form: "" });
				await createUser({
					email,
					fullName,
					userType,
					password,
					confirmPassword,
				});
				setShowModal(true);
			} catch (err) {
				setErrors({ ...errors, form: err.err });
			}
		}
		setIsSubmitting(false);
	};

	return (
		<>
			<Form onSubmit={onSubmit}>
				<Row>
					<Col xs={12}>{errors.form && <Alert variant="danger">{errors.form}</Alert>}</Col>
				</Row>
				<Row>
					<Col xs={12} md={6}>
						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type={"email"}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={emailValidation}
								isInvalid={!!errors.email}
							/>
							<Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
						</Form.Group>
					</Col>
					<Col xs={12} md={6}>
						<Form.Group>
							<Form.Label>Full name</Form.Label>
							<Form.Control
								type={"text"}
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								isInvalid={!!errors.fullName}
							/>
							<Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col xs={12} md={6}>
						<Form.Group className="mt-4">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type={"password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								isInvalid={!!errors.password}
							/>
							<Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
						</Form.Group>
					</Col>
					<Col xs={12} md={6}>
						<Form.Group>
							<Form.Label className="mt-4">Confirm password</Form.Label>
							<Form.Control
								type={"password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								onBlur={confirmPasswordValidation}
								isInvalid={!!errors.confirmPassword}
							/>
							<Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col xs={12}>
						<Form.Group className="mt-4">
							<Form.Label>User type</Form.Label>
							<Form.Select
								value={userType}
								onChange={(e) => setUserType(e.target.value)}
								isInvalid={!!errors.userType}
							>
								<option value="">Select a user type</option>
								{Object.values(UserType).map((userType) => (
									<option key={userType} value={userType}>
										{capitalizeAndReplaceUnderscores(userType)}
									</option>
								))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">{errors.userType}</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button type="submit" className="mt-4" variant="success" disabled={isSubmitting}>
							Sign in
						</Button>
					</Col>
				</Row>
			</Form>
			<Modal show={showModal} onHide={() => setShowModal(false)} backdrop={"static"}>
				<Modal.Header>
					<Modal.Title>Registration completed</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>An email has been sent to your email address to verify it</p>
				</Modal.Body>
				<Modal.Footer>
					<Link to="/" className="btn btn-success">
						Go to homepage
					</Link>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default SignInForm;