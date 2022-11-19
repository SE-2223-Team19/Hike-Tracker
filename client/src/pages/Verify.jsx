import { Col, Row } from "react-bootstrap";
import React from "react";
import { verifyUser } from "../api/users";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Verify = () => {
    const { uniqueString } = useParams();
    const [message, setMessage] = useState("");

    const verify = async () => {
        const response = await verifyUser(uniqueString);
        setMessage(response.message);
    };

    useEffect(() => {
        verify();
    }, []);

    return (
        <Row>
            <Col>
                {message}
            </Col>
        </Row>
    );
};

export default Verify;
