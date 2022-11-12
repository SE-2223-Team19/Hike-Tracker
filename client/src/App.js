import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useState, useEffect, Navigate } from "react";
import { getUserInfo, logIn, logOut } from './api/user';
// import API from "./api";

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [message, setMessage] = useState('');

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
			setMessage({ msg: `Welcome, ${user.name} s${user.id}!`, type: 'success' });
		}
		catch (err) {
			// console.log(err);
			setMessage({ msg: `Incorrect username or password`, type: 'danger' });
		}
	};

	const handleLogout = async () => {
		await logOut();
		setLoggedIn(false);
		setMessage({ msg: `Logout successful!`, type: 'success' });
	};

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout mode="home" loggedIn={loggedIn} logout={handleLogout} />} />
				<Route path="/login" element={loggedIn ? <Navigate replace to='/' /> : <Layout mode="login" message={message} setMessage={setMessage} login={handleLogin} />} />
			</Routes>
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
		default:
			outlet = <Home />;
	}

	// Page returned to the browser on considering the mode specified on the routes in App component
	return outlet;
}

export default App;
