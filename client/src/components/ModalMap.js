import { React } from "react";
import { Button, Modal } from "react-bootstrap";
import HikeTrackMap from "./Hike/HikeTrackMap";

function ModalMap({ handleClose, hike }) {
	return (
		<Modal show={hike} onHide={handleClose}>
			<Modal.Header>
				<Modal.Title>{hike && hike.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<HikeTrackMap hike={hike} />
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalMap;
