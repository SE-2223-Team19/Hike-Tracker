import { Button, Form, Modal, Stack } from "react-bootstrap";
import { React, useState, useMemo } from "react";
import { updateLocation } from "../api/locations";
import { LocationType } from "../helper/enums";

function ModelFormHut({ currentHut, show, setShow, setCurrentHut }) {

	const onSaveModifiedHut = async (ev) => {

		ev.preventDefault()
		await updateLocation(currentHut._id, {
			name: currentHut.name,
			description: currentHut.description,
			numberOfBeds: currentHut.numberOfBeds,
			email: currentHut.email,
			phone: currentHut.phone,
			webSite: currentHut.webSite,
			locationType: LocationType.HUT
		})

		setShow(false)
	}

	return <Modal show={show} >
		<Modal.Header>
			<Modal.Title>Modify Hut</Modal.Title>
		</Modal.Header>

		<Form onSubmit={(ev) => onSaveModifiedHut(ev)}>
			<Modal.Body>
				<Form.Group>
					<Form.Label>Description</Form.Label>
					<Form.Control
						value={currentHut ? currentHut.description : ""}
						onChange={(ev) => {
							setCurrentHut({ ...currentHut, description: ev.target.value })
						}}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Name</Form.Label>
					<Form.Control
						value={currentHut ? currentHut.name : ""}
						onChange={(ev) => {
							setCurrentHut({ ...currentHut, name: ev.target.value })
						}}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>phone</Form.Label>
					<Form.Control
						value={currentHut ? currentHut.phone : ""}
						onChange={(ev) => {
							setCurrentHut({ ...currentHut, phone: ev.target.value })
						}}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>email</Form.Label>
					<Form.Control
						type="email"
						value={currentHut ? currentHut.email : ""}
						onChange={(ev) => {
							setCurrentHut({ ...currentHut, email: ev.target.value })
						}}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>web site</Form.Label>
					<Form.Control
						value={currentHut ? currentHut.webSite : ""}
						onChange={(ev) => {
							setCurrentHut({ ...currentHut, webSite: ev.target.value })
						}}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Number Of Beds</Form.Label>
					<Form.Control
						value={currentHut ? currentHut.numberOfBeds : ""}
						type="number"
						onChange={(ev) => {
							setCurrentHut({ ...currentHut, numberOfBeds: ev.target.value })
						}}
					/>
				</Form.Group>

			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={() => setShow(false)}>
					Close
				</Button>
				<Button variant="success" type="submit">
					Save
				</Button>
			</Modal.Footer>
		</Form>
	</Modal >
}

export default ModelFormHut