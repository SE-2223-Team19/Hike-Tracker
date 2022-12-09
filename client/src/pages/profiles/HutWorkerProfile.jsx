import { React, useState, useMemo } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { getHuts } from "../../api/locations.js"
import Huts, { HutCard } from "../Huts.jsx";
import Loading from "../../components/Loading.jsx";
import NoData from "../../components/NoData";
import PaginatedList from "../../components/pagination/PaginatedList.jsx";
import ModelFormHut from "../../components/ModelFormHut.jsx";

const HutWorkerProfile = ({user}) => {

	const [currentHut, setCurrentHut] = useState(undefined);
	const [show, setShow] = useState(false)

	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<Stack direction="horizontal" gap={3}>
				</Stack>
			</Stack>
			<Huts setCurrentHut={setCurrentHut} setShow={setShow} show = {show}/>
			<ModelFormHut show = {show} currentHut = {currentHut} setCurrentHut = {setCurrentHut} setShow = {setShow}/>
		</>
	);
};

export default HutWorkerProfile;
