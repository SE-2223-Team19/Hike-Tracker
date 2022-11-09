import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet'

function Map(props) {

  // Coordinates of Turin
  const position = [45.068370, 7.683070];

  return (<MapContainer style = {{width: "100%", height: "100vh"}} center={position} zoom={13} scrollWheelZoom={false} >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        We study here .-.
      </Popup>
    </Marker>
  </MapContainer>)
}

export default Map