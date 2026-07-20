import axios from "axios";
import Constants from "expo-constants";
import { useAuthStore } from "@/store/auth";

function expoProxyBaseUrl() {
  const expoConstants = Constants as typeof Constants & {
    expoGoConfig?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  };
  const hostUri =
    Constants.expoConfig?.hostUri ||
    expoConstants.expoGoConfig?.debuggerHost ||
    expoConstants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    return null;
  }

  const host = hostUri.replace(/^exp:\/\//, "").replace(/^https?:\/\//, "");
  const protocol = host.includes("exp.direct") ? "https" : "http";
  return `${protocol}://${host}`;
}

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl;

const apiUrl = configuredApiUrl && configuredApiUrl !== "auto" ? configuredApiUrl : expoProxyBaseUrl() || "http://10.0.2.2:8010";

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Station = {
  id: string;
  name: string;
  brand: string;
  stationCategory?: "shubh" | "integrated" | "private";
  societyName?: string;
  locality?: string;
  isPrivateHub?: boolean;
  isShubhHub?: boolean;
  distance_km?: number;
  operational_status: string;
  verification_status: string;
  demo_charging_enabled: boolean;
  demo_charger_id?: string;
  connector_summary: string[];
  tariff_summary?: string;
  maps_url_type: string;
  google_maps_url?: string;
  coordinates: { latitude: number; longitude: number };
  max_power_kw?: number;
  access_type?: string;
  area?: string;
  address?: string;
  pricePerKwh?: number;
  powerLabel?: string;
  availabilityLabel?: string;
  trustScore?: number;
  rating?: number;
  reviewCount?: number;
  etaMin?: number;
  amenities?: string[];
  connectorDetails?: Array<{ id: string; type: string; power: string; status: string }>;
  parkingFee?: string;
  platformFee?: number;
  idleFee?: string;
  hours?: string;
  paymentMethods?: string[];
  reviews?: Array<{ name: string; rating: number; comment: string; vehicle?: string; time?: string }>;
  data_source?: "presentation_demo" | "research";
};

export function customerStationStatus(station: Station) {
  if (station.demo_charging_enabled) {
    return { label: "Charging available", tone: "success" as const };
  }
  if ((station.operational_status || "").toLowerCase().includes("unknown")) {
    return { label: "Live status unavailable", tone: "warning" as const };
  }
  return { label: station.operational_status || "Status updating", tone: "info" as const };
}

export function connectorLabel(station: Station) {
  if (station.connectorDetails?.length) {
    return [...new Set(station.connectorDetails.map((item) => item.type))].join(", ");
  }
  const visible = (station.connector_summary || []).filter((item) => item && !item.toLowerCase().includes("evidence"));
  if (visible.length) {
    return visible.join(", ");
  }
  return station.demo_charging_enabled ? "CCS2 / Type 2 options" : "Connector info updating";
}

export function tariffLabel(station: Station) {
  if (station.pricePerKwh) {
    return `Rs ${station.pricePerKwh}/kWh`;
  }
  if (!station.tariff_summary || station.tariff_summary.toLowerCase().includes("evidence")) {
    return station.demo_charging_enabled ? "Pay at station" : "Tariff shown before start";
  }
  return station.tariff_summary.replace("INR", "Rs");
}

export function distanceLabel(station: Station) {
  return typeof station.distance_km === "number" ? `${station.distance_km.toFixed(1)} km` : "Distance unavailable";
}
