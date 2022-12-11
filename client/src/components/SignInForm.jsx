import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Button, Modal, Alert, ListGroup } from "react-bootstrap";
import { UserType } from "../helper/enums";
import { capitalizeAndReplaceUnderscores } from "../helper/utils";
import { createUser } from "../api/users";
import { getHuts } from "../api/locations";
import HutSelection from "./HutSelection";

function SignInForm() {
	const [email, setEmail] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [userType, setUserType] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [huts, setHuts] = useState([]);
	const [hutsSelected, setHutsSelected] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [showModalHutWorker, setShowModalHutWorker] = useState(false);
	const [errors, setErrors] = useState({
		email: "",
		fullName: "",
		password: "",
		confirmPassword: "",
		userType: "",
		form: "",
	});

	const addHutToList = (hut) => {
		setHutsSelected((olderList) => [...olderList, hut]);
	};

	const removeHutToList = (hut) => {
		setHutsSelected(hutsSelected.filter((item) => item !== hut));
	};

	useEffect(() => {
		const fetchHuts = async () => {
			const huts = await getHuts();
			setHuts(huts);
		};
		fetchHuts();
	}, []);

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
		const test = Object.values(UserType)
			.filter((userType) => userType !== UserType.PLATFORM_MANAGER)
			.some((t) => t === userType);
		setErrors({ ...errors, userType: test ? "" : "Unknown user type" });
		return test;
	};

	const hutsSelectedValidation = () => {
		const test = hutsSelected.length !== 0;
		setErrors({ ...errors, form: "You have to select at least 1 hut where you work" });
		return test;
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		if ([emailValidation(), confirmPasswordValidation(), userTypeValidation()].every((a) => a)) {
			try {
				setErrors({ ...errors, form: "" });
				let user = {
					email,
					fullName,
					userType,
					password,
					confirmPassword,
				};
				if (userType === UserType.HUT_WORKER && hutsSelectedValidation()) {
					setErrors({ ...errors, form: "" });
					user = { ...user, hutsSelected };
				}

				await createUser(user);

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
								data-test-id="email"
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
								data-test-id="fullName"
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
								data-test-id="password"
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
								data-test-id="confirmPass"
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
								data-test-id="userType"
								value={userType}
								onChange={(e) => setUserType(e.target.value)}
								isInvalid={!!errors.userType}
							>
								<option value="">Select a user type</option>
								{Object.values(UserType)
									.filter((userType) => userType !== UserType.PLATFORM_MANAGER)
									.map((userType) => (
										<option key={userType} value={userType}>
											{capitalizeAndReplaceUnderscores(userType)}
										</option>
									))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">{errors.userType}</Form.Control.Feedback>
							{userType === UserType.HUT_WORKER && (
								<Button
									variant="success"
									className="mt-2"
									onClick={() => setShowModalHutWorker(true)}
								>
									Select the hut
								</Button>
							)}
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button
							data-test-id="sign-in"
							type="submit"
							className="mt-4"
							variant="success"
							disabled={isSubmitting}
						>
							Sign in
						</Button>
					</Col>
				</Row>
			</Form>
			<Modal
				show={showModalHutWorker}
				onHide={() => {
					setShowModalHutWorker(false);
					setHutsSelected([]);
				}}
				backdrop={"static"}
				scrollable={true}
				style={{ maxHeight: "70vh" }}
			>
				<Modal.Header closeButton>
					<Modal.Title>Select the huts where you work</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListGroup style={{ overflow: "scroll" }}>
						{huts.map((hut) => (
							<HutSelection
								key={hut._id}
								hutsSelected={hutsSelected}
								hut={hut}
								addHutToList={addHutToList}
								removeHutToList={removeHutToList}
							/>
						))}
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="success"
						onClick={() => {
							setShowModalHutWorker(false);
						}}
					>
						Save
					</Button>
				</Modal.Footer>
			</Modal>
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
