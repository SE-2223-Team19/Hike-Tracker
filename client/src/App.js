import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Map from "./pages/Map";
import SignIn from "./pages/SignIn";
import Verify from "./pages/Verify";
import { useState, useEffect } from "react";
import { getUserInfo, logIn, logOut } from "./api/sessions";
// import API from "./api";

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const checkAuth = async () => {
			const user = await getUserInfo();
			if (user !== null) {
				setLoggedIn(true);
			}
		};
		checkAuth();
	}, []);

	const handleLogin = async (credentials) => {
		try {
			const user = await logIn(credentials);
			setLoggedIn(true);
			setMessage({ msg: `Welcome, ${user.fullName}!`, type: "success" });
		} catch (err) {
			// console.log(err);
			setMessage({ msg: `Incorrect username or password`, type: "danger" });
		}
	};

	const handleLogout = async () => {
		await logOut();
		setLoggedIn(false);
		setMessage({ msg: `Logout successful!`, type: "secondary" });
	};

	return (
		<BrowserRouter>
			<Container className="p-4">
				<Routes>
					<Route path="/sign-in" element={<Layout mode="sign-in" />} />
					<Route
						path="/*"
						element={
							<Layout
								mode="home"
								logout={handleLogout}
								loggedIn={loggedIn}
								setMessage={setMessage}
								message={message}
							/>
						}
					/>
					<Route
						path="/login"
						element={
							loggedIn ? (
								<Navigate replace to="/" />
							) : (
								<Layout
									mode="login"
									login={handleLogin}
									message={message}
									setMessage={setMessage}
								/>
							)
						}
					/>
					<Route path="/map" element={<Layout mode="map" />} />
					<Route path="/verify/:uniqueString" element={<Layout mode="verify" />} />
				</Routes>
			</Container>
		</BrowserRouter>
	);
}

function Layout(props) {
	const mode = props.mode;

	let outlet = <></>;

	switch (mode) {
		case "login":
			outlet = <Login message={props.message} setMessage={props.setMessage} login={props.login} />;
			break;
		case "home":
			outlet = (
				<Home
					logout={props.logout}
					loggedIn={props.loggedIn}
					setMessage={props.setMessage}
					message={props.message}
				/>
			);
			break;
		case "sign-in":
			outlet = <SignIn />;
			break;
		case "map":
			outlet = <Map />;
			break;
		case "verify":
			outlet = <Verify />;
			break;
		default:
			outlet = <Home />;
	}

	// Page returned to the browser on considering the mode specified on the routes in App component
	return outlet;
}

export default App;
