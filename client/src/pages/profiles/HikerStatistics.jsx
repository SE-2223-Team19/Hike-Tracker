import { React, useState, useEffect, useContext } from "react";
import { Stack, Card, Container, Row, Col } from "react-bootstrap";
import { BiTrendingUp, BiTime, BiWalk, BiMapAlt, BiRun, BiDirections } from "react-icons/bi";
import { MdHiking } from "react-icons/md";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import { useNavigate } from "react-router-dom";
import { getStats } from "../../api/hikes";
import { AuthContext } from "../../context/AuthContext";
import CountUp from 'react-countup';

const HikerStatistics = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});

    useEffect(() => {
        setLoading(true);
        const fetchStats = async () => {
            const stats = await getStats(user._id);
            console.log(stats);
            setStats(stats);
            setLoading(false);
        };
        if (user) {
            fetchStats();
        } else {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            <div className="w-100">
                <Stack direction="horizontal" className="justify-content-between align-items-center">
                    <h2>My Statistics</h2>
                </Stack>
                {loading && <Loading />}
                {JSON.stringify(stats) === "{}" && !loading && (
                    <NoData message={"No statistics found."} />
                )}
                {!(JSON.stringify(stats) === "{}") && !loading && (
                    <Statistics
                        key={user._id}
                        stats={stats}
                    />
                )}
            </div>
        </>
    );
};

const Statistics = ({ stats }) => {
    return (
        <Container>
            <Row className="g-3 row-cols-1 row-cols-sm-1 row-cols-md-5">
                {(stats.numberHikes) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiDirections /> Completed Hikes
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row>
                                        <h2 className="ms-1">
                                            <CountUp end={stats.numberHikes} />
                                        </h2>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {(stats.numberKilometers) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <MdHiking /> Travelled Kilometers
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row className="justify-content-md-center ">
                                        <h3 className="ms-1">
                                            <CountUp end={stats.numberKilometers}
                                                decimals={2}
                                                decimal="," /> km
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {(stats.highestAltitudeRange) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiTrendingUp /> Highest Altitude Range
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row className="justify-content-md-center ">
                                        <h3 className="ms-1">
                                            <CountUp end={stats.highestAltitudeRange}
                                                decimals={2}
                                                decimal="," /> m
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {stats.longestLengthHike && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiMapAlt /> Longest Length Hike
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row>
                                        <h3 className="ms-1">
                                            <CountUp end={stats.longestLengthHike}
                                                decimals={2}
                                                decimal="," /> km
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {(stats.longestTimeHike) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiTime /> Longest Time Hike
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row className="justify-content-md-center ">
                                        <h3 className="ms-1">
                                            <CountUp end={Math.floor(stats.longestTimeHike)} /> h <CountUp end={Math.floor((stats.longestTimeHike - Math.floor(stats.longestTimeHike)) * 60)} /> min
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {stats.shortestLengthHike && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiMapAlt /> Shortest Length Hike
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row>
                                        <h3 className="ms-1">
                                            <CountUp end={stats.shortestLengthHike}
                                                decimals={2}
                                                decimal="," /> km
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {(stats.shortestTimeHike) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiTime /> Shortest Time Hike
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row className="justify-content-md-center ">
                                        <h3 className="ms-1">
                                            <CountUp end={Math.floor(stats.shortestTimeHike)} /> h <CountUp end={Math.floor((stats.shortestTimeHike - Math.floor(stats.shortestTimeHike)) * 60)} /> min
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {(stats.averagePace) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiWalk /> Average Pace
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row className="justify-content-md-center ">
                                        <h3 className="ms-1">
                                            <CountUp end={stats.averagePace}
                                                decimals={2}
                                                decimal="," /> min/km
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
                {(stats.fastestPacedHike) && (
                    <Col>
                        <Card className="flex-col p-3 mt-4">
                            <Card.Body>
                                <Card.Title>
                                    <Stack
                                        direction="horizontal"
                                        className="justify-content-between align-items-center"
                                    >
                                        <h5>
                                            <BiRun /> Fastest Paced Hike
                                        </h5>
                                    </Stack>
                                </Card.Title>
                                <div>
                                    <Row className="justify-content-md-center ">
                                        <h3 className="ms-1">
                                            <CountUp end={stats.fastestPacedHike}
                                                decimals={2}
                                                decimal="," /> min/km
                                        </h3>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default HikerStatistics;
