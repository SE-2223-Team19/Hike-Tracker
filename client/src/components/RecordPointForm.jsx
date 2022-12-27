import { React, useState, useEffect, useContext } from "react";
import { Col, Row, Button } from "react-bootstrap";
import SelectPointMap from "./SelectPointMap";

function RecordPoint({ regHike, setPoint }) {

    const trackPoints = regHike.hike.trackPoints.coordinates.map(e => {
		return [...e].reverse()
	})

	return (
		<Col>
			<Row>
				<Col style={{"height": "50vh"}}>
					<SelectPointMap setPoint = {setPoint} regHike = {regHike} trackPoints = {trackPoints}/>
				</Col>
			</Row>
		</Col>
	);

}

export default RecordPoint;