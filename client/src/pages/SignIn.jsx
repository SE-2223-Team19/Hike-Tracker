import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CgArrowLeft } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import SignInForm from "../components/SignInForm";

function SignIn() {

    const navigate = useNavigate();

    return (
        <>
            <Row>
                <Col>
                    <Button variant="outline-dark" onClick={() => navigate("/")}>
                        <CgArrowLeft />
                        <span>Back</span>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="mb-5">Sign In</h1>
                </Col>
            </Row>
            <Row>
                <SignInForm />
            </Row>
        </>
    );
}

export default SignIn;