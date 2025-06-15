import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configurar íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const socket = io(import.meta.env.VITE_SERVER_URL);

export const JobsMapping = () => {
  const [myLocation, setMyLocation] = useState({ lat: 42.004, lng: -4.52 });
  const [others, setOthers] = useState([]);
  const [mss, setMss] = useState("");
  const [tracking, setTracking] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Función para iniciar el rastreo de ubicación
  const startTracking = () => {
    if (!navigator.geolocation) {
      setMss("Geolocalización no habilitada");
      return;
    }

    setTracking(true);
    const id = setInterval(() => {
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
    }, 10000);

    setIntervalId(id);
  };

  // Escuchar ubicaciones de otros usuarios

  useEffect(() => {
    socket.on("location", (data) => {
      console.log("📍 Ubicación recibida:", data); // <-- Este log
      setOthers((prev) => {
        const updated = prev.filter((u) => u.id !== data.id);
        return [...updated, data];
      });
    });

    return () => {
      socket.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div>
      <Link to="/">Volver</Link>
      <button onClick={startTracking} disabled={tracking}>
        {tracking ? "Ubicación compartiéndose..." : "Compartir mi ubicación"}
      </button>

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

      <pre style={{ color: "white" }}>{JSON.stringify(others, null, 2)}</pre>
    </div>
  );
};
