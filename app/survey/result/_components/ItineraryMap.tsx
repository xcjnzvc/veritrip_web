"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Schedule } from "../../mock/itinerary";

const categoryColors: Record<string, string> = {
  음식점: "#FF9300",
  쇼핑: "#00B173",
};

function createNumberedIcon(number: number, color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px;
      height: 28px;
      background: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 13px;
      line-height: 1;
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function ItineraryMap({ schedules }: { schedules: Schedule[] }) {
  const center: [number, number] = [schedules[0].lat, schedules[0].lng];
  const path: [number, number][] = schedules.map((s) => [s.lat, s.lng]);

  return (
    <MapContainer
      key={`${center[0]}-${center[1]}`} // 좌표를 키값으로 활용
      center={center}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 경로 점선 */}
      <Polyline positions={path} pathOptions={{ color: "#aaa", weight: 2, dashArray: "6 4" }} />

      {/* 번호 마커 */}
      {schedules.map((s, idx) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={createNumberedIcon(idx + 1, categoryColors[s.category] ?? "#5E0E8C")}
        >
          <Popup>{s.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
