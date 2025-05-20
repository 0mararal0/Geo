import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const JobsMapping = () => {
  const [state, setState] = useState({
    lat: 0,
    lng: 0,
    zoom: 15,
  });
  const [mss, setMss] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        setMss("Geolocalización habilitada");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setState({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              zoom: 15,
            });
            setMss("Ubicación obtenida correctamente");
          },
          (error) => {
            console.error("Error al obtener la ubicación:", error);
            setMss(`Error: ${error.message}`);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setMss("Geolocalización no habilitada");
      }
    }, 20000); // cada 20 segundos

    return () => clearInterval(interval);
  }, []);

  console.log(state);

  return (
    <div>
      <Link to="/">Volver</Link>
      <MapContainer
        center={{ lat: 41.65518, lng: -4.72345 }}
        zoom={15}
        style={{ height: "80vh", width: "100dvw" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[state.lat, state.lng]} />
      </MapContainer>
      <p style={{ color: "white" }}>{mss}</p>
    </div>
  );
};
