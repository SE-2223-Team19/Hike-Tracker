import React, { useContext } from "react";
import { Button, Col, Form, Image, Row, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import GenericError from "./errors/GenericError";
import { CgArrowLeft } from "react-icons/cg";
import { AuthContext } from "../context/AuthContext";
import HutIcon from "../components/Hut/HutIcon";
import { FaBed } from "react-icons/fa";
import { BiGlobe, BiPhone } from "react-icons/bi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { TbMail } from "react-icons/tb";
import HutMap from "../components/Hut/HutMap";
import { useState } from "react";
import { useFormik } from "formik";
import { getBase64 } from "../helper/utils";
import { uploadHutPicture } from "../api/locations";
import ModalFormHut from "../components/Hut/ModalFormHut";

const HutDetail = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, setMessage } = useContext(AuthContext);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [show, setShow] = useState(false);

	const formik = useFormik({
		initialValues: {
			photo: null,
		},
		onSubmit: async (values) => {
			const photo = values.photo;
			const base64photo = await getBase64(photo);
			const res = await uploadHutPicture(hut._id, base64photo);
			if (res && !res.err) {
				setMessage({ type: "success", msg: "Photo uploaded" });
				navigate(-1);
				return;
			}
			setMessage({ type: "danger", msg: res.err });
		},
	});

	const { hut } = location.state;

	if (!hut) {
		return <GenericError />;
	}

	return (
		<>
			<Button variant="outline-dark" onClick={() => navigate(-1)}>
				<CgArrowLeft className="me-2" />
				Back
			</Button>
			<h1 className="mt-4">{hut.name}</h1>

			<Row className="mt-4">
				<Col xl={3}>
					<HutIcon icon={<FaBed size={24} />} text={`${hut.numberOfBeds} beds`} />
				</Col>

				<Col xl={3}>
					<HutIcon icon={<BiPhone size={24} />} text={`${hut.phone}`} />
				</Col>

				<Col xl={3}>
					<HutIcon icon={<BiGlobe size={24} />} text={`${hut.webSite}`} />
				</Col>

				<Col xl={3}>
					<HutIcon icon={<TbMail size={24} />} text={`${hut.email}`} />
				</Col>
			</Row>
			<div className="mt-4 h-100">{hut.description}</div>

			{/** Map */}
			<div className="mt-4">
				<HutMap hut={hut} height={300} zoom={10} />
			</div>

			{/** Photos */}
			<h4 className="mt-4">Photos</h4>
			{/** Only for hut workers of the hut */}
			<Row>
				{/** Hut photos saved */}
				{hut.photos.map((photo) => (
					<Col>
						<Image
							src={photo.data ? photo.data : ""}
							rounded
							style={{ maxHeight: "200px", objectFit: "cover", marginTop: "1rem" }}
						/>
					</Col>
				))}
			</Row>
			{hut.peopleWorks.includes(user._id) && (
				<Stack direction="horizontal" gap={3}>
					<Button
						variant="outline-success"
						className="mt-2"
						onClick={() => setShowUploadForm(!showUploadForm)}
					>
						<div className="d-flex flex-row align-items-center">
							<MdOutlineAddPhotoAlternate size={24} className="me-2" />
							Upload photo
						</div>
					</Button>
					<Button variant="outline-primary" className="mt-2" onClick={() => setShow(true)}>
						Update hut
					</Button>
				</Stack>
			)}
			{showUploadForm && (
				<Form onSubmit={formik.handleSubmit}>
					<Form.Group controlId="uploadPhoto" className="mt-4 d-flex flex-row align-items-center">
						<Form.Control
							type="file"
							name="thumbnail"
							onChange={(e) => {
								formik.setFieldValue("photo", e.target.files[0]);
								const hutPhoto = document.getElementById("photo-img-hut");
								hutPhoto.src = URL.createObjectURL(e.target.files[0]);
							}}
							className="me-3"
						/>
						<Button variant="success" type="submit">
							Save
						</Button>
					</Form.Group>
					<img
						id="photo-img-hut"
						src={""}
						alt=""
						className="img-fluid mt-4"
						style={{ maxHeight: "500px" }}
					/>
				</Form>
			)}
			<ModalFormHut currentHut={hut} setShow={setShow} show={show} />
		</>
	);
};

export default HutDetail;
