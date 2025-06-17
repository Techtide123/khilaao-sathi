import React from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';


const RouteMap = ({ senderLat, senderLng, claimerLat, claimerLng }) => {
    // Define icons
    const senderIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -30],
    });

    const claimerIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -30],
    });

    const senderPos = [senderLat, senderLng];
    const claimerPos = [claimerLat, claimerLng];
    return (
        <MapContainer
            center={senderPos}
            zoom={8}
            style={{ height: "200px", width: "100%", borderRadius: "1rem" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Sender Marker */}
            <Marker position={senderPos} icon={senderIcon}>
                <Popup>Sender's Location</Popup>
            </Marker>

            {/* Claimer Marker */}
            <Marker position={claimerPos} icon={claimerIcon}>
                <Popup>Claimer's Location</Popup>
            </Marker>

            {/* Polyline route between them */}
            <Polyline positions={[senderPos, claimerPos]} color="green" />
        </MapContainer>
    );
}

export default RouteMap