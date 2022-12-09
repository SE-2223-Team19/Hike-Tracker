import { Button, Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap"

function HutSelection({ hut, addHutToList, hutsSelected, removeHutToList }) {

    function removeInsertHut() {
        if (hutsSelected.includes(hut._id)) {
            removeHutToList(hut._id)
        } else {
            addHutToList(hut._id)
        }
    }

    let active = hutsSelected.includes(hut._id) ? "active" : ""

    return <><Row><Col lg={8}><li className={"list-group-item " + active} onClick={() => removeInsertHut(hut)}>{hut.name}</li></Col>
        <Col><OverlayTrigger
            placement="right"
            overlay={
                <Tooltip >
                    {hut.numberOfBeds ? "Number of Beds: " + hut.numberOfBeds :  ""} <br/>
                    {hut.phone ? "Phone: " + hut.phone :  ""} <br/>
                    {hut.webSite ? "Web site: " + hut.webSite :  ""} <br/>
                    {hut.description ? "Description: " + hut.description :  ""} <br/>
                    {hut.email ? "Email: " + hut.email : ""}
                </Tooltip>
            }
        >
            <Button variant="success">See Details</Button>
        </OverlayTrigger></Col>
    </Row>

    </>
}

export default HutSelection
