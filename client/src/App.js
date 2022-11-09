import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Map from "./pages/Map"
// import API from "./api";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout mode="home" />} />
				<Route path="/login" element={<Layout mode="login" />} />
				<Route path="/map" element={<Layout mode="map" />} />
			</Routes>
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
		case "map":
			outlet = <Map />;
			break;
		default:
			outlet = <Home />;
	}

	// Page returned to the browser on considering the mode specified on the routes in App component
	return outlet;
}

export default App;
