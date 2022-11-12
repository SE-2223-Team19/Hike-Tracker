import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useState } from "react";
import DescribeTable from "./pages/Describehikes";

// import API from "./api";

function App() {

	
	const [Describehikes,setDescribehike]=useState([])

	const Data_Load=()=>{

	}

	const RemoveDescriprtion=(description)=>{
		const remove = Describehikes.filter((x) => (description._id !== x._id))
		setDescribehike(remove)

	}
	const AddDescription=(description)=>{
		const add = ((OldDescribehikes)=>[...OldDescribehikes,description])
		setDescribehike(add)
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
		case "Describehikes":
		    outlet =<DescribeTable Description={Describehikes} RemoveDescriprtion={RemoveDescriprtion} AddDescription={AddDescription} />;
			break;	
		default:
			outlet = <Home />;
	}

	// Page returned to the browser on considering the mode specified on the routes in App component
	return outlet;
}
return (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Layout mode="home" />} />
			<Route path="/login" element={<Layout mode="login" />} />
			<Route path="/Describehikes" element={<Layout mode="Describehikes" />} />
		</Routes>
	</BrowserRouter>
);

}

export default App;
