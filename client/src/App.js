import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./context/AuthContext";
import Verify from "./pages/Verify";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Container className="p-4">
					<Routes>
						<Route path="/sign-in" element={<SignIn />} />
						<Route path="/login" element={<Login />} />
						<Route path="/verify/:uniqueString" element={<Verify />} />
						<Route path="/*" element={<Home />} />
					</Routes>
				</Container>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
