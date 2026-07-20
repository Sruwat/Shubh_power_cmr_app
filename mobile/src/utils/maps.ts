import { Alert, Linking } from "react-native";
import { Station } from "@/api/client";

function encodeStationQuery(station: Station) {
  const parts = [station.name, station.address, station.area, station.brand].filter(Boolean);
  return encodeURIComponent(parts.join(", "));
}

export function googleMapsDirectionsUrl(station: Station) {
  const coordinates = station.coordinates;
  if (coordinates?.latitude && coordinates?.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}&travelmode=driving`;
  }
  if (station.google_maps_url) {
    return station.google_maps_url;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeStationQuery(station)}`;
}

function geoDirectionsUrl(station: Station) {
  const coordinates = station.coordinates;
  const label = encodeStationQuery(station);
  if (coordinates?.latitude && coordinates?.longitude) {
    return `geo:${coordinates.latitude},${coordinates.longitude}?q=${coordinates.latitude},${coordinates.longitude}(${label})`;
  }
  return `geo:0,0?q=${label}`;
}

export async function openGoogleMapsDirections(station: Station) {
  const urls = [googleMapsDirectionsUrl(station), geoDirectionsUrl(station)];
  for (const url of urls) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      // Try the next navigation format before showing an error.
    }
  }
  Alert.alert("Maps unavailable", "Please install or enable Google Maps or a browser, then try navigation again.");
}
