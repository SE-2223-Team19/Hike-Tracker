import React, { useEffect, useState } from "react";
import { verifyUser } from "../api/users";
import { useParams } from "react-router-dom";

const Verify = () => {
	const { uniqueString } = useParams();
	const [message, setMessage] = useState("");
	const [verified, setVerified] = useState(false);

	useEffect(() => {
		const verify = async () => {
			const response = await verifyUser(uniqueString);
			setMessage(response.message);
			setVerified(response.verified);
		};
		verify();
	}, [uniqueString]);

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				textAlign: "center",
			}}
		>
			{verified ? (
				<div>
					<h1 style={{ fontSize: "100px", color: "#69df6f" }}>
						<i className="bi bi-envelope-check"></i>
					</h1>
					<h2 style={{ fontWeight: "bold" }}>{message}</h2>
					<h4>You can continue using our application!</h4>
				</div>
			) : (
				<div>
					<h1 style={{ fontSize: "100px", color: "#ff3d3d" }}>
						<i className="bi bi-envelope-x"></i>
					</h1>
					<h2 style={{ fontWeight: "bold" }}>{message}</h2>
					<h4>The verification link is not valid.</h4>
				</div>
			)}
		</div>
	);
};

export default Verify;
