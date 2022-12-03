import { useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function LoginForm() {
	const { handleLogin } = useContext(AuthContext);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		const credentials = { username, password };
		handleLogin(credentials);
	};

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email</Form.Label>
					<Form.Control
						data-test-id="email"
						type="email"
						placeholder="Enter email"
						value={username}
						onChange={(ev) => setUsername(ev.target.value)}
						required={true}
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						data-test-id="password"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(ev) => setPassword(ev.target.value)}
						required={true}
					/>
				</Form.Group>
				<Row style={{ textAlign: "center" }}>
					<Col>
						<Button variant="success" type="submit">
							Login
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

export default LoginForm;
