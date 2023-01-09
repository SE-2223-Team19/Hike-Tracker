import { React, useEffect, useState } from "react";
import { getRegisteredHikeById } from "../api/hikes";
import { Stack, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import HikeTrackMap from "../components/Hike/HikeTrackMap";
import { BiRuler, BiTime, BiTrendingUp, BiPlay, BiStop } from "react-icons/bi";
import { RegisteredHikeStatus } from "../helper/enums";

import {
    capitalizeAndReplaceUnderscores,
    difficultyToColor,
    displayExpectedTime,
    displayLength,
} from "../helper/utils";

const BroadcastedUrl = () => {
    
    const { id } = useParams();

    const [registeredHike, setRegisteredHike] = useState(null);

    useEffect(() => {
        const getRegisteredHike = async () => {
            const hike = await getRegisteredHikeById(id);
            if (hike) {
                setRegisteredHike(hike);
            }
        }
        const interval = setInterval(() => {
            getRegisteredHike();
        }, 5000);
        return () => clearInterval(interval);

    }, [id]);

    return (
        registeredHike &&
        <>
            <h1 className="mt-4">Follow {registeredHike.user.fullName} during the {registeredHike.hike.title} hike!</h1>
            {registeredHike.status === RegisteredHikeStatus.PLANNED && (
                <h3>
                    This planned hike has not started yet.
                </h3>
            )}

            <Stack direction="horizontal" gap={3} className="me-auto my-4">
                <div className="d-flex flex-row">
                    <BiRuler size={24} />
                    <span className="ms-1">{displayLength(registeredHike.hike.length)} Km</span>
                </div>
                <div className="d-flex flex-row">
                    <BiTrendingUp size={24} />
                    <span className="ms-1">{registeredHike.hike.ascent.toFixed(2)} m</span>
                </div>
                <div className="d-flex flex-row">
                    <BiTime size={24} />
                    <span className="ms-1">{displayExpectedTime(registeredHike.hike.expectedTime)}</span>
                </div>

                {registeredHike.status !== RegisteredHikeStatus.PLANNED && (
                    <div className="d-flex flex-row ms-auto">
                        <BiPlay size={24} />
                        <span className="ms-1">{new Date(registeredHike.startTime).toUTCString()}</span>
                    </div>
                )}
                {registeredHike.status === RegisteredHikeStatus.COMPLETED && (
                    <div className="d-flex flex-row">
                        <BiStop size={24} />
                        <span className="ms-1">{new Date(registeredHike.endTime).toUTCString()}</span>
                    </div>
                )}

                <div className="ms-auto">
                    <Badge bg={difficultyToColor(registeredHike.hike.difficulty)}>
                        {capitalizeAndReplaceUnderscores(registeredHike.hike.difficulty)}
                    </Badge>
                </div>
            </Stack>
            <div className="mt-4">{registeredHike.hike.description}</div>

            <div className="mt-4">
                <HikeTrackMap hike={{ ...registeredHike.hike, trackPoints: registeredHike.hike.trackPoints.coordinates.map(p => [p[1], p[0]]) }} recordedPoints={registeredHike.recordedPoints} timePoints={registeredHike.timePoints} altitudeRecordedPoints={registeredHike.altitudeRecordedPoints} />
            </div>
        </>
    );
};

export default BroadcastedUrl;
