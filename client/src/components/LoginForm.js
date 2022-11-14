import { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials);
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} required={true} />
                </Form.Group>
                <Row style={{ textAlign: "center" }}>
                    <Col>
                        <Button style={{ backgroundColor: "#0089c9" }} type="submit"> Login </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default LoginForm;