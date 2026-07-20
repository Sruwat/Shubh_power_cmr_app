import { Station } from "@/api/client";
import importedStations from "@/data/importedStations.json";
import { stations as curatedStations } from "@/data/experience";

export type PresentationStation = Station & {
  area: string;
  address: string;
  pricePerKwh: number;
  powerLabel: string;
  availabilityLabel: string;
  trustScore: number;
  rating: number;
  reviewCount: number;
  etaMin: number;
  amenities: string[];
  connectorDetails: Array<{ id: string; type: string; power: string; status: string }>;
  parkingFee: string;
  platformFee: number;
  idleFee: string;
  hours: string;
  paymentMethods: string[];
  reviews?: Array<{ name: string; rating: number; comment: string; vehicle?: string; time?: string }>;
  data_source: "presentation_demo" | "research";
};

export function withPresentation(station: Station, index = 0): PresentationStation {
  const imported = (importedStations as Station[]).find((item) => item.id === station.id || item.name === station.name);
  const row = imported ?? curatedStations[index % curatedStations.length];
  const source = { ...row, ...station };
  const isDemo = Boolean(imported || station.demo_charging_enabled || station.data_source === "presentation_demo");
  return {
    ...station,
    name: station.name || row.name,
    brand: station.brand || row.brand,
    stationCategory: source.stationCategory,
    societyName: source.societyName,
    locality: source.locality,
    isPrivateHub: source.isPrivateHub,
    isShubhHub: source.isShubhHub,
    access_type: source.access_type,
    area: station.area || row.area || station.name,
    address: station.address || row.address || station.name,
    coordinates: station.coordinates || row.coordinates,
    google_maps_url: station.google_maps_url || row.google_maps_url,
    pricePerKwh: station.pricePerKwh ?? row.pricePerKwh ?? 18,
    powerLabel: station.powerLabel ?? row.powerLabel ?? "Power updating",
    availabilityLabel: station.availabilityLabel ?? row.availabilityLabel ?? "Limited data",
    trustScore: station.trustScore ?? row.trustScore ?? 70,
    rating: station.rating ?? row.rating ?? 4.0,
    reviewCount: station.reviewCount ?? row.reviewCount ?? 0,
    etaMin: station.etaMin ?? row.etaMin ?? Math.max(8, Math.round((station.distance_km ?? 3) * 4)),
    amenities: station.amenities ?? row.amenities ?? ["Public access"],
    connectorDetails: station.connectorDetails ?? row.connectorDetails ?? [{ id: station.demo_charger_id ?? "CP01", type: "CCS2", power: "Updating", status: "Check at station" }],
    parkingFee: station.parkingFee ?? row.parkingFee ?? "Check at station",
    platformFee: station.platformFee ?? row.platformFee ?? 0,
    idleFee: station.idleFee ?? row.idleFee ?? "Check at station",
    hours: station.hours ?? row.hours ?? "Open Now",
    paymentMethods: station.paymentMethods ?? row.paymentMethods ?? ["Shubh Power Wallet", "UPI", "Credit / Debit Card"],
    reviews: station.reviews ?? row.reviews ?? seededReviews(station.name || row.name),
    data_source: isDemo ? "presentation_demo" : "research"
  };
}

export const importedStationFallback = importedStations as Station[];

function seededReviews(stationName: string) {
  return [
    { name: "Nikhil D.", rating: 5, time: "3 days ago", vehicle: "Tata Nexon EV", comment: `${stationName} was easy to find and the connector flow was smooth.` },
    { name: "Vikas Bhola", rating: 4, time: "4 days ago", vehicle: "Mahindra XEV 9e", comment: "Good parking access and the tariff was clear before charging." },
    { name: "Priya S.", rating: 5, time: "Last week", vehicle: "MG ZS EV", comment: "Reliable app guidance, QR scan and payment confirmation worked well." }
  ];
}

export const walletTransactions = [
  { title: "Charging - Sector 62", time: "Today 10:31 AM", amount: "-Rs 343", status: "Complete" },
  { title: "Refund - Booking cancel", time: "Today 09:12 AM", amount: "+Rs 466", status: "Refunded" },
  { title: "Added via UPI", time: "Yesterday 6:45 PM", amount: "+Rs 500", status: "Success" },
  { title: "Charging - DLF Mall", time: "16 Jul 3:22 PM", amount: "-Rs 218", status: "Complete" },
  { title: "Refund - Failed txn", time: "12 Jul 10:05 AM", amount: "+Rs 50", status: "Pending" }
];

export const chargingHistory = [
  { station: "Shubh Power EV Hub, Sector 22", time: "Today - 10:00 AM", amount: "Rs 343", status: "Complete", meta: "CCS2 - 14.2 kWh - 31 min" },
  { station: "Ambience Mall Private Hub", time: "16 Jul - 3:00 PM", amount: "Rs 218", status: "Complete", meta: "Type 2 - 10.8 kWh - 28 min" },
  { station: "Golf Course Road Hub", time: "13 Jul - 2:00 PM", amount: "Rs 512", status: "Complete", meta: "CCS2 - 22.1 kWh - 22 min" },
  { station: "Connaught Place, Delhi", time: "10 Jul - 9:30 AM", amount: "Rs 98", status: "Failed", meta: "Type 2 - 5.2 kWh - 45 min" }
];
