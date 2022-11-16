import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Map from "./pages/Map";
import { useState, useEffect, Navigate } from "react";
import { getUserInfo, logIn, logOut } from "./api/user";
import DescribeHike from "./pages/DescribeHike";
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
			setMessage({ msg: `Welcome, ${user.name} s${user.id}!`, type: "success" });
		} catch (err) {
			// console.log(err);
			setMessage({ msg: `Incorrect username or password`, type: "danger" });
		}
	};

	const handleLogout = async () => {
		await logOut();
		setLoggedIn(false);
		setMessage({ msg: `Logout successful!`, type: "success" });
	};

	return (
		<BrowserRouter>
			<Container className="p-4">
				<Routes>
					<Route path="/*" element={<Layout mode="home" />} />
					<Route path="/login" element={<Layout mode="login" />} />
					<Route path="/map" element={<Layout mode="map" />} />
					<Route path="/describe-hike" element={<Layout mode="describe-hike"/>} />
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
			outlet = <Home logout={props.logout} loggedIn={props.loggedIn} />;
			break;
		case "map":
			outlet = <Map />;
			break;
		case "describe-hike":
			outlet = <DescribeHike />
			break;
		default:
			outlet = <Home />;
	}

	// Page returned to the browser on considering the mode specified on the routes in App component
	return outlet;
}

export default App;
