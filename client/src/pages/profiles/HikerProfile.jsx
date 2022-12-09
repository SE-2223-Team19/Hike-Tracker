import { React, useState, useEffect } from "react";
import { Button, Stack, Card, Container, Row, Col, Modal } from "react-bootstrap";
import { BiRuler, BiTrendingUp, BiTime, BiWalk, BiMap } from "react-icons/bi";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import { CgOptions } from "react-icons/cg";
import HikeFilters from "../../components/Hike/HikeFilters";
import { useNavigate } from "react-router-dom";
import PositionFilterModal from "../../components/PositionFilterModal";
import PositionPreferenceModal from "../../components/PositionPreferenceModal";
import { capitalizeAndReplaceUnderscores } from "../../helper/utils";
import { getPreferences, deletePreferences, updatePreferences } from "../../api/users";
import { getHikes } from "../../api/hikes";
import HikeCard from "../../components/Hike/HikeCard";
import ModalMap from "../../components/ModalMap";

const HikerProfile = ({ user }) => {
    const navigate = useNavigate();
    const [openPreferences, setOpenPreferences] = useState(false);
    const [savedPreferences, setSavedPreferences] = useState({});
    const [currentPreferences, setCurrentPreferences] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPositionFilter, setShowPositionFilter] = useState(false);
    const [showPositionPreference, setShowPositionPreference] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [modalType, setModalType] = useState("");

    useEffect(() => {
        setLoading(true);
        const fetchPreferences = async () => {
            const preferences = await getPreferences();
            setSavedPreferences(preferences);
            setLoading(false);
        };
        if (user) {
            fetchPreferences();
        } else {
            navigate("/");
        }
    }, [user, navigate]);
    const removePreferences = async () => {
        await deletePreferences();
        setSavedPreferences({});
        setCurrentPreferences({});
        setOpenPreferences(false);
    };
    const savePreferences = async () => {
        await updatePreferences(currentPreferences);
        setSavedPreferences(currentPreferences);
    };

    return (
        <>
            <div className="w-100">
                <Stack direction="horizontal" className="justify-content-between align-items-center">
                    <h1>My Preferences</h1>
                    <Button
                        variant={openPreferences ? "success" : "outline-success"}
                        style={{ borderRadius: 20 }}
                        onClick={() => {
                            setOpenPreferences(!openPreferences);
                        }}
                    >
                        <CgOptions style={{ marginRight: ".4rem" }} />
                        Set Preferences
                    </Button>
                </Stack>
                {/* Filters */}
                {openPreferences && (
                    <div>
                        <HikeFilters
                            filters={currentPreferences}
                            setFilters={setCurrentPreferences}
                            openModal={() => setShowPositionFilter(true)}
                        />
                        <Stack direction="horizontal" gap={3} style={{ marginTop: "10px" }}>
                            <Button variant={"danger"} onClick={() => {
                                setShowConfirmationModal(true);
                                setModalType("delete");
                            }}>Remove</Button>
                            <Button variant={"secondary"} onClick={() => {
                                setCurrentPreferences({});
                                setOpenPreferences(false);
                            }}>Cancel</Button>
                            <Button variant={"success"} onClick={() => {
                                setShowConfirmationModal(true);
                                setModalType("save");
                            }}>Ok</Button>
                        </Stack>
                    </div>
                )}
                {loading && <Loading />}
                <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} backdrop={"static"}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType === "delete" ? "Delete preferences" : "Save preferences"} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to {modalType} your preferences?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {modalType === "delete" ? <Button className="btn btn-danger" onClick={() => { setShowConfirmationModal(false); removePreferences(); }}>Delete</Button> : <Button className="btn btn-success" onClick={() => { setShowConfirmationModal(false); savePreferences(); }}>Save</Button>}
                    </Modal.Footer>
                </Modal>
                <PositionFilterModal
                    show={showPositionFilter}
                    setShow={setShowPositionFilter}
                    onCancel={() => setShowPositionFilter(false)}
                    onOk={(coordinates, radius) => {
                        setShowPositionFilter(false);
                        setCurrentPreferences({
                            ...currentPreferences,
                            locationCoordinatesLat: coordinates[0],
                            locationCoordinatesLng: coordinates[1],
                            locationRadius: radius * 1000,
                        });
                    }}
                    onRemoveFilter={() => {
                        setShowPositionFilter(false);
                        const { locationCoordinatesLat, locationCoordinatesLng, locationRadius, ...p } = currentPreferences;
                        setCurrentPreferences(p);
                    }}
                ></PositionFilterModal>
                {(JSON.stringify(savedPreferences) === '{}') && !loading && <NoData message={"No preferences found."} />}
                {!(JSON.stringify(savedPreferences) === '{}') && !loading && <Preferences key={user._id} savedPreferences={savedPreferences} setShowPositionPreference={setShowPositionPreference} /> && <Hikes savedPreferences={savedPreferences} />}
                <PositionPreferenceModal show={showPositionPreference}
                    setShow={setShowPositionPreference} coordinates={[savedPreferences.locationCoordinatesLat, savedPreferences.locationCoordinatesLng]} radius={savedPreferences.locationRadius} />
            </div>
        </>
    );
};
const Preferences = ({ savedPreferences, setShowPositionPreference }) => {
    return (
        <Container>
            <Row className="g-4 row-cols-1 row-cols-sm-1 row-cols-md-3">
                {(savedPreferences.minLength || savedPreferences.maxLength) && <Col>
                    <Card className="flex-col p-3 mt-4">
                        <Card.Body>
                            <Card.Title>
                                <Stack direction="horizontal" className="justify-content-between align-items-center">
                                    <h5><BiRuler /> Length</h5>
                                </Stack>
                            </Card.Title>
                            <div>
                                <Row >
                                    <span className="ms-1"><b>Min: </b> {savedPreferences.minLength ? savedPreferences.minLength : 0}</span>
                                    <span className="ms-1"> <b>Max: </b> {savedPreferences.maxLength ? savedPreferences.maxLength : 0}</span>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>}
                {(savedPreferences.minAscent || savedPreferences.maxAscent) && <Col>
                    <Card className="flex-col p-3 mt-4">
                        <Card.Body>
                            <Card.Title>
                                <Stack direction="horizontal" className="justify-content-between align-items-center">
                                    <h5><BiTrendingUp /> Ascent</h5>
                                </Stack>
                            </Card.Title>
                            <div>
                                <Row className="justify-content-md-center ">
                                    <span className="ms-1"><b>Min: </b> {savedPreferences.minAscent}</span>
                                    <span className="ms-1"><b>Max: </b> {savedPreferences.maxAscent}</span>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>}
                {(savedPreferences.minExpectedTime || savedPreferences.maxExpectedTime) && <Col>
                    <Card className="flex-col p-3 mt-4">
                        <Card.Body>
                            <Card.Title>
                                <Stack direction="horizontal" className="justify-content-between align-items-center">
                                    <h5><BiTime /> Expected Time</h5>
                                </Stack>
                            </Card.Title>
                            <div>
                                <Row className="justify-content-md-center ">
                                    <span className="ms-1"><b>Min: </b> {savedPreferences.minExpectedTime ? savedPreferences.minExpectedTime : 0}</span>
                                    <span className="ms-1"><b>Max: </b> {savedPreferences.maxExpectedTime ? savedPreferences.maxExpectedTime : 0}</span>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>}
                {savedPreferences.difficulty && <Col>
                    <Card className="flex-col p-3 mt-4">
                        <Card.Body>
                            <Card.Title>
                                <Stack direction="horizontal" className="justify-content-between align-items-center">
                                    <h5><BiWalk /> Difficulty</h5>
                                </Stack>
                            </Card.Title>
                            <div>
                                <Row >
                                    <span className="ms-1"> {capitalizeAndReplaceUnderscores(savedPreferences.difficulty)}</span>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>}
                {(savedPreferences.locationCoordinatesLat || savedPreferences.locationCoordinatesLng || savedPreferences.locationRadius) && <Col>

                    <Card className="flex-col p-3 mt-4">
                        <Card.Body>
                            <Card.Title>
                                <Stack direction="horizontal" className="justify-content-between align-items-center">
                                    <h5><BiMap /> Location</h5>
                                    <Button onClick={() => setShowPositionPreference(true)} variant={"success"} className="d-block">
                                        See area
                                    </Button>
                                </Stack>
                            </Card.Title>
                            <div>
                                <Row className="justify-content-md-center ">
                                    <span className="ms-1"><b>Lat: </b> {savedPreferences.locationCoordinatesLat}</span>
                                    <span className="ms-1"><b>Lng: </b> {savedPreferences.locationCoordinatesLng}</span>
                                    <span className="ms-1"><b>Radius: </b> {savedPreferences.locationRadius}</span>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>}
            </Row>
        </Container>
    );
};

const Hikes = ({ savedPreferences }) => {
    const [currentHike, setCurrentHike] = useState(null);
    const [hikes, setHikes] = useState([]);
    useEffect(() => {
        const fetchCall = async () => {
            const tmp = await getHikes(savedPreferences);
            setHikes(tmp);
        }
        fetchCall();
    }, [savedPreferences]);
    return <>
        <h1>Filtered hikes: {hikes.length}</h1>
        {hikes.map(h => <HikeCard hike={h} key={h._id} showDetails={setCurrentHike} />)}
        <ModalMap handleClose={() => setCurrentHike(null)} hike={currentHike}></ModalMap>
    </>
};

export default HikerProfile;