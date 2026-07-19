import { Station } from "@/api/client";

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

const demoRows = [
  {
    name: "Shubh Power EV Hub",
    brand: "Shubh Power",
    area: "Sector 62, Noida",
    address: "Plot 15, Sector 62, Noida, UP 201301",
    pricePerKwh: 18,
    powerLabel: "50 kW DC",
    availabilityLabel: "4/8 free",
    trustScore: 94,
    rating: 4.6,
    reviewCount: 312,
    etaMin: 7,
    amenities: ["Parking", "Restrooms", "CCTV", "Wi-Fi"],
    connectorDetails: [
      { id: "CP01", type: "CCS2", power: "50 kW DC", status: "Ready to charge" },
      { id: "CP02", type: "CCS2", power: "50 kW DC", status: "In use · ~20 min wait" },
      { id: "CP03", type: "CHAdeMO", power: "50 kW DC", status: "Ready to charge" },
      { id: "CP05", type: "Type 2", power: "22 kW AC", status: "Ready to charge" }
    ],
    parkingFee: "Free (2 hrs)",
    platformFee: 35,
    idleFee: "Rs 2/min after 10 min"
  },
  {
    name: "Tata Power EZ Charge",
    brand: "Tata Power",
    area: "DLF Mall, Sector 18",
    address: "DLF Mall of India, Sector 18, Noida",
    pricePerKwh: 14,
    powerLabel: "22 kW AC",
    availabilityLabel: "2/6 free",
    trustScore: 88,
    rating: 4.4,
    reviewCount: 187,
    etaMin: 13,
    amenities: ["Mall", "Parking", "Food", "CCTV"],
    connectorDetails: [
      { id: "TP01", type: "Type 2", power: "22 kW AC", status: "Ready to charge" },
      { id: "TP02", type: "Bharat AC001", power: "10 kW AC", status: "Ready to charge" }
    ],
    parkingFee: "Mall parking",
    platformFee: 25,
    idleFee: "Rs 1/min after 15 min"
  },
  {
    name: "Statiq Fast Charger",
    brand: "Statiq",
    area: "Cyber Hub, Gurugram",
    address: "Cyber Hub, DLF Cyber City, Gurugram",
    pricePerKwh: 22,
    powerLabel: "120 kW DC",
    availabilityLabel: "1/4 free",
    trustScore: 97,
    rating: 4.8,
    reviewCount: 524,
    etaMin: 28,
    amenities: ["Food", "Lounge", "CCTV", "Valet"],
    connectorDetails: [
      { id: "ST01", type: "CCS2", power: "120 kW DC", status: "Ready to charge" },
      { id: "ST02", type: "CHAdeMO", power: "50 kW DC", status: "In use" }
    ],
    parkingFee: "Paid parking",
    platformFee: 40,
    idleFee: "Rs 3/min after 10 min"
  },
  {
    name: "Adani EV Charging",
    brand: "Adani",
    area: "Connaught Place, Delhi",
    address: "Inner Circle, Connaught Place, New Delhi",
    pricePerKwh: 12,
    powerLabel: "30 kW DC",
    availabilityLabel: "Full",
    trustScore: 82,
    rating: 4.2,
    reviewCount: 146,
    etaMin: 34,
    amenities: ["Public access", "CCTV", "Parking"],
    connectorDetails: [
      { id: "AD01", type: "CCS2", power: "30 kW DC", status: "Busy" },
      { id: "AD02", type: "Bharat DC001", power: "15 kW DC", status: "Busy" }
    ],
    parkingFee: "NDMC rates",
    platformFee: 30,
    idleFee: "Rs 2/min after 10 min"
  },
  {
    name: "Jio-bp Pulse",
    brand: "Jio-bp",
    area: "Sector 29, Gurugram",
    address: "Sector 29 Market, Gurugram",
    pricePerKwh: 20,
    powerLabel: "60 kW DC",
    availabilityLabel: "3/5 free",
    trustScore: 91,
    rating: 4.5,
    reviewCount: 241,
    etaMin: 31,
    amenities: ["Food", "Parking", "Restrooms"],
    connectorDetails: [
      { id: "JB01", type: "CCS2", power: "60 kW DC", status: "Ready to charge" },
      { id: "JB02", type: "Type 2", power: "22 kW AC", status: "Ready to charge" }
    ],
    parkingFee: "Free",
    platformFee: 35,
    idleFee: "Rs 2/min after 10 min"
  }
];

export function withPresentation(station: Station, index = 0): PresentationStation {
  const row = demoRows[index % demoRows.length];
  const isDemo = station.demo_charging_enabled || index < demoRows.length;
  return {
    ...station,
    name: isDemo ? row.name : station.name,
    brand: isDemo ? row.brand : station.brand,
    area: isDemo ? row.area : station.name,
    address: isDemo ? row.address : station.name,
    pricePerKwh: isDemo ? row.pricePerKwh : 18,
    powerLabel: isDemo ? row.powerLabel : "Power updating",
    availabilityLabel: isDemo ? row.availabilityLabel : "Limited data",
    trustScore: isDemo ? row.trustScore : 70,
    rating: isDemo ? row.rating : 4.0,
    reviewCount: isDemo ? row.reviewCount : 0,
    etaMin: isDemo ? row.etaMin : Math.max(8, Math.round((station.distance_km ?? 3) * 4)),
    amenities: isDemo ? row.amenities : ["Public access"],
    connectorDetails: isDemo ? row.connectorDetails : [{ id: station.demo_charger_id ?? "CP01", type: "CCS2", power: "Updating", status: "Check at station" }],
    parkingFee: isDemo ? row.parkingFee : "Check at station",
    platformFee: isDemo ? row.platformFee : 0,
    idleFee: isDemo ? row.idleFee : "Check at station",
    hours: "Open Now",
    paymentMethods: ["Shubh Power Wallet", "UPI", "Credit / Debit Card"],
    data_source: isDemo ? "presentation_demo" : "research"
  };
}

export const walletTransactions = [
  { title: "Charging · Sector 62", time: "Today 10:31 AM", amount: "-Rs 343", status: "Complete" },
  { title: "Refund · Booking cancel", time: "Today 09:12 AM", amount: "+Rs 466", status: "Refunded" },
  { title: "Added via UPI", time: "Yesterday 6:45 PM", amount: "+Rs 500", status: "Success" },
  { title: "Charging · DLF Mall", time: "16 Jul 3:22 PM", amount: "-Rs 218", status: "Complete" },
  { title: "Refund · Failed txn", time: "12 Jul 10:05 AM", amount: "+Rs 50", status: "Pending" }
];

export const chargingHistory = [
  { station: "Shubh Power EV Hub, Sector 62", time: "Today · 10:00 AM", amount: "Rs 343", status: "Complete", meta: "CCS2 · 14.2 kWh · 31 min" },
  { station: "DLF Mall, Sector 18", time: "16 Jul · 3:00 PM", amount: "Rs 218", status: "Complete", meta: "Type 2 · 10.8 kWh · 28 min" },
  { station: "Cyber Hub, Gurugram", time: "13 Jul · 2:00 PM", amount: "Rs 512", status: "Complete", meta: "CCS2 · 22.1 kWh · 22 min" },
  { station: "Connaught Place, Delhi", time: "10 Jul · 9:30 AM", amount: "Rs 98", status: "Failed", meta: "Type 2 · 5.2 kWh · 45 min" }
];
