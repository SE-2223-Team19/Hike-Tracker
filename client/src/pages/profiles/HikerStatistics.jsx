import { React, useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
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
            <Row>
                <h3>
                    My Statistics
                </h3>
            </Row>
            <Row style={{ marginTop: "10px" }}>
                <Col>
                    <Row>
                        <h5 >
                            <BiDirections /> Completed Hikes
                        </h5>
                        <h6 >
                            <CountUp end={stats.numberHikes} />
                        </h6>
                    </Row>
                    <Row>
                        <h5>
                            <MdHiking /> Travelled Kilometers
                        </h5>
                        <h6 >
                            <CountUp end={stats.numberKilometers}
                                decimals={2}
                                decimal="," /> km
                        </h6>
                    </Row>
                    <Row>

                        <h5>
                            <BiTrendingUp /> Highest Altitude Range
                        </h5>
                        <h6 >
                            <CountUp end={stats.highestAltitudeRange}
                                decimals={2}
                                decimal="," /> m
                        </h6>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <h5>
                            <BiMapAlt /> Longest Length Hike
                        </h5>
                        <h6 >
                            <CountUp end={stats.longestLengthHike}
                                decimals={2}
                                decimal="," /> km
                        </h6>
                    </Row>
                    <Row>
                        <h5>
                            <BiTime /> Longest Time Hike
                        </h5>
                        <h6 >
                            <CountUp end={Math.floor(stats.longestTimeHike)} /> h <CountUp end={Math.floor((stats.longestTimeHike - Math.floor(stats.longestTimeHike)) * 60)} /> min
                        </h6>
                    </Row>
                    <Row>
                        <h5>
                            <BiMapAlt /> Shortest Length Hike
                        </h5>
                        <h6 >
                            <CountUp end={stats.shortestLengthHike}
                                decimals={2}
                                decimal="," /> km
                        </h6>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <h5>
                            <BiTime /> Shortest Time Hike
                        </h5>
                        <h6 >
                            <CountUp end={Math.floor(stats.shortestTimeHike)} /> h <CountUp end={Math.floor((stats.shortestTimeHike - Math.floor(stats.shortestTimeHike)) * 60)} /> min
                        </h6>
                    </Row>
                    <Row>
                        <h5>
                            <BiWalk /> Average Pace
                        </h5>
                        <h6 >
                            <CountUp end={stats.averagePace}
                                decimals={2}
                                decimal="," /> min/km
                        </h6>
                    </Row>
                    <Row>

                        <h5>
                            <BiRun /> Fastest Paced Hike
                        </h5>
                        <h6 >
                            <CountUp end={stats.fastestPacedHike}
                                decimals={2}
                                decimal="," /> min/km
                        </h6>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default HikerStatistics;
