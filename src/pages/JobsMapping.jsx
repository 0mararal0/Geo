import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
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

const socket = io("http://localhost:5005");

export const JobsMapping = () => {
  const [myLocation, setMyLocation] = useState({ lat: 42.004, lng: -4.52 });
  const [others, setOthers] = useState([]);
  const [mss, setMss] = useState("");

  useEffect(() => {
    // Enviar ubicación cada 20 segundos
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMyLocation({ lat: latitude, lng: longitude });
            socket.emit("location", { latitude, longitude });
            setMss("Ubicación enviada");
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
    }, 20000);

    // Recibir ubicaciones de otros usuarios
    socket.on("location", (data) => {
      setOthers((prev) => [...prev, data]); // puedes optimizar esto para evitar duplicados
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Link to="/">Volver</Link>
      <MapContainer
        center={{ lat: myLocation.lat, lng: myLocation.lng }}
        zoom={15}
        style={{ height: "80vh", width: "100dvw" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Tu ubicación */}
        <Marker position={[myLocation.lat, myLocation.lng]} />

        {/* Otros usuarios */}
        {others.map((user, index) => (
          <Marker key={index} position={[user.latitude, user.longitude]} />
        ))}
      </MapContainer>
      <p style={{ color: "white" }}>{mss}</p>
    </div>
  );
};
