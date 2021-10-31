import React from "react";
import { Map, Marker } from "pigeon-maps"
import { osm } from 'pigeon-maps/providers'
// import "leaflet/dist/leaflet.css";
export default function BirdMap(props) {
    const { position, observations } = props
    let obs = observations["results"].slice(0, 30)
    let markers = obs.map(observation => observation.location.split(",").map(coord => parseFloat(coord)))
    return (<div>
        <div className="map__container">
            <Map height={300} defaultCenter={[position.lat, position.lon]} defaultZoom={11} provider={osm}>
                {markers.map((marker, index) => <Marker key={index} anchor={marker} />)}
            </Map>
        </div>
    </div>)
}