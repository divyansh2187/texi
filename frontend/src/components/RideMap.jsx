
import React, { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const captainMarkerIcon = new L.DivIcon({
    className: "",
    html: `
      <div style="
        width:42px;
        height:42px;
        background:white;
        border:2px solid #FACC15;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:25px;
        box-shadow:0 2px 8px #0005;
      ">
        👨‍✈️
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
});

const currentLocationIcon = new L.DivIcon({
    className: "",
    html: `
    <div style="
      width:18px;
      height:18px;
      background:#2563eb;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px #0005;
    "></div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});


const passengerLocationIcon = new L.DivIcon({
    className: "",
    html: `
    <div style="
      width:20px;
      height:20px;
      background:#16a34a;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px #0005;
    "></div>
  `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

const pickupIcon = new L.DivIcon({
    className: "",
    html: `
    <div style="
      width:18px;
      height:18px;
      background:#16a34a;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px #0005;
    "></div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

const destinationIcon = new L.DivIcon({
    className: "",
    html: `
    <div style="
      width:18px;
      height:18px;
      background:#d97706;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px #0005;
    "></div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

const defaultIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});


const MapUpdater = ({ currentLocation, routeCoordinates, rideStage }) => {
    const map = useMap();
    const hasCenteredOnUser = React.useRef(false);
    const previousStage = React.useRef(null);

    useEffect(() => {
        // Center the map on the user's GPS location the first time it arrives
        if (currentLocation && !hasCenteredOnUser.current) {
            map.setView(
                [currentLocation.lat, currentLocation.lng],
                16
            );
            hasCenteredOnUser.current = true;
        }

        // Fit the destination route when the ride starts
        if (
            rideStage === "ongoing" &&
            previousStage.current !== "ongoing" &&
            routeCoordinates?.length > 0
        ) {
            map.fitBounds(routeCoordinates, {
                padding: [70, 70],
            });
        }

        previousStage.current = rideStage;
    }, [currentLocation, routeCoordinates, rideStage, map]);

    return null;
};


const RideMap = ({
    currentLocation,
    pickupCoordinates,
    passengerLocation,
    isCaptainLocation = false,
    destinationCoordinates,
    routeCoordinates = [],
    captainLocation,
    rideStage,
}) => {
    const center = currentLocation
        ? [currentLocation.lat, currentLocation.lng]
        : [26.4499, 74.6399];

    return (
        <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom={true}
            zoomControl={false}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
            className="w-full h-full"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {currentLocation && (
                <Marker
                    position={center}
                    icon={isCaptainLocation ? captainMarkerIcon : currentLocationIcon}
                />
            )}


            {/* Captain's live location during ongoing ride */}
            {rideStage === "ongoing" && captainLocation && (
                <Marker
                    position={[
                        captainLocation.lat,
                        captainLocation.lng,
                    ]}
                    icon={captainMarkerIcon}
                />
            )}



            {/* Passenger live GPS marker */}
            {passengerLocation && (
                <Marker
                    position={[
                        passengerLocation.lat,
                        passengerLocation.lng,
                    ]}
                    icon={passengerLocationIcon}
                />
            )}

            {pickupCoordinates && rideStage !== "accepted" && (
                <Marker
                    position={[
                        pickupCoordinates.lat,
                        pickupCoordinates.lng,
                    ]}
                    icon={pickupIcon}
                />
            )}

            {destinationCoordinates && (
                <Marker
                    position={[
                        destinationCoordinates.lat,
                        destinationCoordinates.lng,
                    ]}
                    icon={destinationIcon}
                />
            )}

            {routeCoordinates.length > 0 && (
                <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                        color: "#2563eb",
                        weight: 6,
                        opacity: 0.9,
                    }}
                />
            )}

            <MapUpdater
                currentLocation={currentLocation}
                routeCoordinates={routeCoordinates}
                rideStage={rideStage}
            />
        </MapContainer>
    );
};

export default RideMap;
