import { ListGroupItem } from "react-bootstrap";

function HutSelection({ hut, addHutToList, hutsSelected, removeHutToList }) {

    function removeInsertHut() {
        if (hutsSelected.includes(hut._id)) {
            removeHutToList(hut._id)
        } else {
            addHutToList(hut._id)
        }
    }

    return hutsSelected.includes(hut._id) ? <ListGroupItem active onClick={() => removeInsertHut(hut)}>{hut.name}</ListGroupItem> :
        <ListGroupItem onClick={() => removeInsertHut(hut)}>{hut.name}</ListGroupItem>
}

export default HutSelection
