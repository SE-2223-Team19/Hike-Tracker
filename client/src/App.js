import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Map from "./pages/Map";
import SignIn from "./pages/SignIn";
import Verify from "./pages/Verify";
import { AuthProvider } from "./context/AuthContext";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Container className="p-4">
					<Routes>
						<Route path="/sign-in" element={<Layout mode="sign-in" />} />
						<Route path="/*" element={<Layout mode="home" />} />
						<Route path="/login" element={<Layout mode="login" />} />
						<Route path="/map" element={<Layout mode="map" />} />
						<Route path="/verify/:uniqueString" element={<Layout mode="verify" />} />
					</Routes>
				</Container>
			</AuthProvider>
		</BrowserRouter>
	);
}

function Layout(props) {
	const mode = props.mode;

	let outlet = <></>;

	switch (mode) {
		case "login":
			outlet = <Login />;
			break;
		case "home":
			outlet = <Home />;
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
