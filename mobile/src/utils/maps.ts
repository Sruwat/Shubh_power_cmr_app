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

export async function openGoogleMapsDirections(station: Station) {
  const url = googleMapsDirectionsUrl(station);
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert("Google Maps unavailable", "Please install or enable a maps app, then try navigation again.");
    return;
  }
  await Linking.openURL(url);
}
