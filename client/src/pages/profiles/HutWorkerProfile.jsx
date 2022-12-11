import { React, useState, useMemo } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import Huts, { HutCard } from "../Huts.jsx";
import ModelFormHut from "../../components/ModelFormHut.jsx";

const HutWorkerProfile = ({user}) => {

	const [currentHut, setCurrentHut] = useState(undefined);
	const [show, setShow] = useState(false)
	const [dirty, setDirty] = useState(false)

	return (
		<>
			<Stack direction="horizontal" className="justify-content-between align-items-center">
				<Stack direction="horizontal" gap={3}>
				</Stack>
			</Stack>
			<Huts setCurrentHut={setCurrentHut} setShow={setShow} dirty = {dirty} setDirty = {setDirty}/>
			<ModelFormHut show = {show} currentHut = {currentHut} setCurrentHut = {setCurrentHut} setShow = {setShow} setDirty = {setDirty}/>
		</>
	);
};

export default HutWorkerProfile;
