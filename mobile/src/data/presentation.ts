import { Station } from "@/api/client";
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
  data_source: "presentation_demo" | "research";
};

export function withPresentation(station: Station, index = 0): PresentationStation {
  const row = curatedStations[index % curatedStations.length];
  const isDemo = station.demo_charging_enabled || index < curatedStations.length;
  const source = isDemo ? row : station;
  return {
    ...station,
    name: isDemo ? row.name : station.name,
    brand: isDemo ? row.brand : station.brand,
    stationCategory: source.stationCategory,
    societyName: source.societyName,
    locality: source.locality,
    isPrivateHub: source.isPrivateHub,
    isShubhHub: source.isShubhHub,
    area: isDemo ? row.area : station.area || station.name,
    address: isDemo ? row.address : station.address || station.name,
    coordinates: isDemo ? row.coordinates : station.coordinates,
    google_maps_url: isDemo ? row.google_maps_url : station.google_maps_url,
    pricePerKwh: isDemo ? row.pricePerKwh : station.pricePerKwh ?? 18,
    powerLabel: isDemo ? row.powerLabel : station.powerLabel ?? "Power updating",
    availabilityLabel: isDemo ? row.availabilityLabel : station.availabilityLabel ?? "Limited data",
    trustScore: isDemo ? row.trustScore : station.trustScore ?? 70,
    rating: isDemo ? row.rating : station.rating ?? 4.0,
    reviewCount: isDemo ? row.reviewCount : station.reviewCount ?? 0,
    etaMin: isDemo ? row.etaMin : station.etaMin ?? Math.max(8, Math.round((station.distance_km ?? 3) * 4)),
    amenities: isDemo ? row.amenities : station.amenities ?? ["Public access"],
    connectorDetails: isDemo ? row.connectorDetails : station.connectorDetails ?? [{ id: station.demo_charger_id ?? "CP01", type: "CCS2", power: "Updating", status: "Check at station" }],
    parkingFee: isDemo ? row.parkingFee : station.parkingFee ?? "Check at station",
    platformFee: isDemo ? row.platformFee : station.platformFee ?? 0,
    idleFee: isDemo ? row.idleFee : station.idleFee ?? "Check at station",
    hours: isDemo ? row.hours : station.hours ?? "Open Now",
    paymentMethods: isDemo ? row.paymentMethods : station.paymentMethods ?? ["Shubh Power Wallet", "UPI", "Credit / Debit Card"],
    data_source: isDemo ? "presentation_demo" : "research"
  };
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
