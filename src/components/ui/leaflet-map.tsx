"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

const THEWORKS_LOCATION: [number, number] = [6.209122, 6.715226];
const BUSINESS_NAME = "Thewworks ICT & Prints";
const BUSINESS_ADDRESS =
  "No. 5, Okelue Street, Opposite Wema Bank, by Nnebisi Road, Asaba, Delta State, Nigeria";

export default function LeafletMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: THEWORKS_LOCATION,
      zoom: 18,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "custom-map-label",
      html: `<div style="background:#b00000;color:#fff;padding:9px 14px;border-radius:50px;font-size:13px;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,0.28);white-space:nowrap;border:2px solid #ffffff;display:inline-block;">Thewworks ICT & Prints</div>`,
      iconSize: [190, 42],
      iconAnchor: [95, 42],
    });

    const googleMapsUrl =
      "https://www.google.com/maps/search/?api=1&query=Thewworks%20ICT%20%26%20Prints%2C%20No.%205%2C%20Okelue%20Street%2C%20Opposite%20Wema%20Bank%2C%20by%20Nnebisi%20Road%2C%20Asaba%2C%20Delta%20State%2C%20Nigeria";

    L.marker(THEWORKS_LOCATION, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<div style="font-size:14px;line-height:1.6;"><strong style="font-size:16px;color:#b00000;">${BUSINESS_NAME}</strong><br/>${BUSINESS_ADDRESS}<br/><a href="${googleMapsUrl}" target="_blank" style="display:inline-block;margin-top:8px;color:#ffffff;background:#b00000;padding:7px 12px;border-radius:8px;text-decoration:none;font-weight:600;">Open in Google Maps</a></div>`)
      .openPopup();

    L.circle(THEWORKS_LOCATION, { radius: 30, color: "#b00000", fillColor: "#b00000", fillOpacity: 0.15 }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <section className="w-full bg-white px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1480px]">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-[#111111] md:text-[34px]">Visit Thewworks ICT & Prints</h2>
        <p className="mx-auto mb-3 max-w-3xl text-center text-base leading-7 text-[#555555]">
          Thewworks, also known as Thewworks ICT & Prints, is located in Asaba, Delta State, Nigeria.
        </p>
        <p className="mx-auto mb-8 max-w-xl text-center text-base leading-7 text-[#555555]">{BUSINESS_ADDRESS}</p>
        <div ref={mapContainerRef} className="h-[300px] w-full rounded-2xl border border-[#e5e5e5] shadow-[0_12px_35px_rgba(0,0,0,0.16)] md:h-[460px]" />
      </div>
    </section>
  );
}
