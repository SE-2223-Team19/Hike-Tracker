import { React, useState, useEffect } from "react";
import { Button, Stack } from "react-bootstrap";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import { CgOptions } from "react-icons/cg";
import HikeFilters from "../../components/Hike/HikeFilters";
import { useNavigate } from "react-router-dom";
import PositionFilterModal from "../../components/PositionFilterModal";

const HikerProfile = ({ user }) => {
    const navigate = useNavigate();
    const [openPreferences, setOpenPreferences] = useState(false);
    const [savedPreferences, setSavedPreferences] = useState({});
    const [currentPreferences, setCurrentPreferences] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPositionFilter, setShowPositionFilter] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchPreferences = async () => {
            /*const preferences = await getPreferences({ userId: user._id });
            setSavedPreferences(preferences);*/
            setLoading(false);
        };
        if (user) {
            fetchPreferences();
        } else {
            navigate("/");
        }
    }, [preferences, user, navigate]);
    const removePreferences = async () => {
        /*await deletePreferences({ userId: user._id });*/
        setSavedPreferences({});
        setCurrentPreferences({});
    };
    const savePreferences = async () => {
        /*await updatePreferences({ userId: user._id, preferences: currentPreferences });*/
        setSavedPreferences(currentPreferences);
        setCurrentPreferences({});
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
                            <Button variant={"danger"} OnClick={() => {
                                removePreferences();
                            }}>Remove</Button>
                            <Button variant={"secondary"} OnClick={() => {
                                setCurrentPreferences({});
                            }}>Cancel</Button>
                            <Button variant={"success"} OnClick={() => {
                                savePreferences();
                            }}>Ok</Button>
                        </Stack>
                    </div>
                )}
                {loading && <Loading />}
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
                {(!savedPreferences || savedPreferences.length <= 0) && !loading && <NoData message={"No preferences found."} />}
            </div>
        </>
    );
};

export default HikerProfile;
