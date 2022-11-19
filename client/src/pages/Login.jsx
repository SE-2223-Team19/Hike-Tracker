import { Alert, Col, Row, Card } from "react-bootstrap";
import LoginForm from "../components/LoginForm";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
	const { message, setMessage, handleLogin } = useContext(AuthContext);

	return (
		<Row>
			<Col>
				<Card
					style={{
						position: "absolute",
						left: "50%",
						top: "40%",
						transform: "translate(-50%, -50%)",
						width: "329px",
						borderRadius: "8px",
						boxShadow: "1px 2px 8px rgba(0, 0, 0, 0.65)",
					}}
				>
					<Card.Header>
						<h3>
							<i className="bi bi-signpost-2"></i> Hike Tracker
						</h3>
					</Card.Header>
					<Card.Body>
						{message && (
							<Row>
								<Alert variant={message.type} onClose={() => setMessage("")} dismissible>
									{message.msg}
								</Alert>
							</Row>
						)}
						<Card.Title style={{ textAlign: "center" }}>Login</Card.Title>
						<LoginForm login={handleLogin} />
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
};

export default Login;
