import React, { useState, useEffect } from "react";
import { Button, Stack, Card, Form, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer } from "react-leaflet";
import { getHuts } from "../api/locations";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import { CgOptions } from "react-icons/cg";
import PositionFilterModal from "../components/PositionFilterModal";


function DescribeHuts() {

    const [huts, setHuts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFilters, setOpenFilters] = useState(false);
    const [filters, setFilters] = useState({});
    const [showPositionFilter, setShowPositionFilter] = useState(false);

    // ** Fetch hikes from API
    useEffect(() => {
        setLoading(true);
        const fetchHikes = async () => {
            const huts = await getHuts({ ...filters })
            setHuts(huts);
            setLoading(false);
            console.log(filters)
        };
        fetchHikes();
    }, [filters]);


    return (
        <div className="w-100">
            <Stack direction="horizontal" className="justify-content-between align-items-center">
                <h1>Huts</h1>
                <Button
                    variant={openFilters ? "success" : "outline-success"}
                    style={{ borderRadius: 20 }}
                    onClick={() => {
                        setOpenFilters(!openFilters);
                        if (openFilters) {
                            setFilters({}); // Clear filters
                        }
                    }}
                >
                    <CgOptions style={{ marginRight: ".4rem" }} />
                    Filters
                </Button>
            </Stack>
            {/* Filters */}
            {openFilters && (
                <HutFilters
                    filters={filters}
                    setFilters={setFilters}
                    openModal={() => setShowPositionFilter(true)}
                />
            )}
            {loading && <Loading />}
            {(!huts || huts.length <= 0) && !loading && <NoData message={"No huts found."} />}
            {huts.length > 0 &&
                !loading &&
                huts.map((hut) => <HutCard key={hut._id} hut={hut} />)}
            <PositionFilterModal
				show={showPositionFilter}
				setShow={setShowPositionFilter}
				onCancel={() => setShowPositionFilter(false)}
				onOk={(coordinates, radius) => {
					setShowPositionFilter(false);
					setFilters({
						...filters,
						locationLat: coordinates[0],
						locationLon: coordinates[1],
						locationRadius: radius * 1000,
					});
				}}
			></PositionFilterModal>
        </div>
    );
};

const HutCard = ({ hut }) => {
    
    return (

        <Card className="flex-col p-3 mt-4">
            <Card.Body>
                <Card.Title>
                    <Stack direction="horizontal" className="justify-content-between align-items-center">
                        <h5>Description: {hut.description}</h5>
                    </Stack>
                </Card.Title>
                <div>
                    <MapHut hut = {hut}/>
                </div>
            </Card.Body>
        </Card>
    );
};

const HutFilters = ({ filters, setFilters, openModal }) => {

    return (
        <Form>
            <Row className="mt-4">
                <Col xs={12} md={5}>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Stack direction="horizontal" gap={2}>
                            <Form.Control
                                type="string"
                                placeholder="Insert a description of hut"
                                onChange={(event) => {
                                    setFilters({ ...filters, description: event.target.value });
                                }}
                            />
                        </Stack>
                        <Form.Label>Location</Form.Label> <br/>
						<Button onClick={openModal} variant={"success"}>Select area</Button>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}

function MapHut({ hut }) {

    return (
        
        <MapContainer
            style={{ width: "100%", height: "50vh" }}
            // center={hut ? hut.point : [0,0] }
            center={hut ? [45.0623969,7.5222874] : [0,0] }
            zoom={9}
            scrollWheelZoom={false}
            zoomControl={false}
            dragging={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        </MapContainer>
    );
}


export default DescribeHuts;
