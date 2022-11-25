import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { updateHike } from "../api/hikes";
import { getLocations, createLocation } from "../api/locations";

function NewReferencePoint() {
  const [LocationType, setLocationType] = useState("");
  const [LatitudePoint, setLatitudePoint] = useState(1);
  const [LongitudePoint, setLongitudePoint] = useState(1);
  const [Description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Location = { locationType: LocationType, description: Description, point: [LatitudePoint, LongitudePoint] };
    let result = await createLocation(Location);
    console.log(result._id);
  }

  return (<Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Location Type</Form.Label>
      <Form.Select onChange={ev => setLocationType(ev.target.value)}>
        <option></option>
        <option>hut</option>
        <option>parking_lot</option>
        <option>default</option>
      </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3">
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Latitude Point</Form.Label>
      <Form.Control onChange={ev => setLatitudePoint(ev.target.value)} />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicCheckbox">
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Longitude Point</Form.Label>
      <Form.Control onChange={ev => setLongitudePoint(ev.target.value)} />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicCheckbox">
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
      <Form.Label>Description</Form.Label>
      <Form.Control as="textarea" rows={3} placeholder="Describe Your status" onChange={ev => setDescription(ev.target.value)} />
    </Form.Group>
    <Button type='submit' size="lg">
      Create and add
    </Button>
  </Form>)
}


function FromList() {
  const [Locations, SetLocation] = useState([]);
  const [LocationToAdd, setLocationToAdd] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tmp = Locations[LocationToAdd.split(")")[0] - 1];
    const l={_id: tmp._id, locationType: tmp.locationType, description: tmp.description, point: {lat: tmp.point[0], lgn: tmp.point[1]}};
    const result = await updateHike("6380a48e833343b0b8906306", {referencePoints : [l]});
    console.log(result);
  }

  useEffect(() => {
    const fetchLocation = async () => {
      const locations = await getLocations();
      SetLocation(locations);
    };
    fetchLocation();
  }, [Reference]);


  let list = [];
  let i = 0;
  for (let l of Locations) {
    i++;
    list.push(<option>{i + ") " + l.locationType + " " + l.description}</option>);
  }

  return <><Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.Label>Choose reference point</Form.Label>
      <Form.Select onChange={(ev) => setLocationToAdd(ev.target.value)}>
        <option></option>
        {list}
      </Form.Select>
    </Form.Group>
    <Button type='submit' size="lg">Add</Button>
  </Form>
  </>
}



function DefineReferenceForm(props) {
  const [Reference, SetReference] = useState(0);


  return <>
    <Button onClick={() => SetReference(0)}>Add from existing</Button>
    <Button onClick={() => SetReference(1)}>Create and add</Button>
    {Reference == 0 ? <FromList /> : <></>}
    {Reference == 1 ? <NewReferencePoint /> : <></>}
  </>

}

const Reference = { DefineReferenceForm }
export default Reference