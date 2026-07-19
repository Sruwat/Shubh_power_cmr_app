import { Station } from "@/api/client";

export type ExperienceStation = Station & {
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
};

export const stations: ExperienceStation[] = [
  {
    id: "demo-1",
    name: "Shubh Power EV Hub",
    brand: "Shubh Power",
    area: "Sector 62, Noida",
    address: "Plot 15, Sector 62, Noida, UP 201301",
    distance_km: 0.8,
    operational_status: "Open Now",
    verification_status: "High",
    demo_charging_enabled: true,
    demo_charger_id: "SP-N62-CP01",
    connector_summary: ["CCS2", "CHAdeMO", "Type 2"],
    tariff_summary: "Rs 18/kWh",
    maps_url_type: "Coordinate navigation URL",
    google_maps_url: "https://www.google.com/maps/search/?api=1&query=28.6270,77.3760",
    coordinates: { latitude: 28.627, longitude: 77.376 },
    pricePerKwh: 18,
    powerLabel: "50 kW DC",
    availabilityLabel: "4/8 free",
    trustScore: 94,
    rating: 4.6,
    reviewCount: 312,
    etaMin: 8,
    amenities: ["Parking", "Restrooms", "CCTV", "Wi-Fi"],
    connectorDetails: [
      { id: "CP01", type: "CCS2", power: "50 kW DC", status: "Ready to charge" },
      { id: "CP02", type: "CCS2", power: "50 kW DC", status: "In use - ~20 min wait" },
      { id: "CP03", type: "CHAdeMO", power: "50 kW DC", status: "Ready to charge" },
      { id: "CP04", type: "CHAdeMO", power: "50 kW DC", status: "Ready to charge" },
      { id: "CP05", type: "Type 2", power: "22 kW AC", status: "Ready to charge" },
      { id: "CP06", type: "Type 2", power: "22 kW AC", status: "Ready to charge" }
    ],
    parkingFee: "Free (2 hrs)",
    platformFee: 35,
    idleFee: "Rs 2/min after 10 min",
    hours: "Open Now",
    paymentMethods: ["Shubh Power Wallet", "UPI", "Credit / Debit Card"]
  },
  {
    id: "demo-2",
    name: "Tata Power EZ Charge",
    brand: "Tata Power",
    area: "DLF Mall, Sector 18",
    address: "DLF Mall of India, Sector 18, Noida",
    distance_km: 1.4,
    operational_status: "Open Now",
    verification_status: "High",
    demo_charging_enabled: true,
    demo_charger_id: "TP-DLF-01",
    connector_summary: ["Type 2", "Bharat AC001"],
    tariff_summary: "Rs 14/kWh",
    maps_url_type: "Coordinate navigation URL",
    coordinates: { latitude: 28.567, longitude: 77.321 },
    pricePerKwh: 14,
    powerLabel: "22 kW AC",
    availabilityLabel: "2/6 free",
    trustScore: 88,
    rating: 4.4,
    reviewCount: 187,
    etaMin: 14,
    amenities: ["Mall", "Parking", "Food", "CCTV"],
    connectorDetails: [
      { id: "TP01", type: "Type 2", power: "22 kW AC", status: "Ready to charge" },
      { id: "TP02", type: "Bharat AC001", power: "10 kW AC", status: "Ready to charge" }
    ],
    parkingFee: "Mall parking",
    platformFee: 25,
    idleFee: "Rs 1/min after 15 min",
    hours: "Open Now",
    paymentMethods: ["UPI", "Credit / Debit Card"]
  },
  {
    id: "demo-3",
    name: "Statiq Fast Charger",
    brand: "Statiq",
    area: "Cyber Hub, Gurugram",
    address: "Cyber Hub, DLF Cyber City, Gurugram",
    distance_km: 3.2,
    operational_status: "Open Now",
    verification_status: "High",
    demo_charging_enabled: true,
    demo_charger_id: "ST-CYB-01",
    connector_summary: ["CCS2", "CHAdeMO"],
    tariff_summary: "Rs 22/kWh",
    maps_url_type: "Coordinate navigation URL",
    coordinates: { latitude: 28.495, longitude: 77.088 },
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
    idleFee: "Rs 3/min after 10 min",
    hours: "Open Now",
    paymentMethods: ["UPI", "Credit / Debit Card"]
  },
  {
    id: "demo-4",
    name: "Adani EV Charging",
    brand: "Adani",
    area: "Connaught Place, Delhi",
    address: "Inner Circle, Connaught Place, New Delhi",
    distance_km: 4.7,
    operational_status: "Busy",
    verification_status: "Medium",
    demo_charging_enabled: false,
    demo_charger_id: "AD-CP-01",
    connector_summary: ["Bharat AC001", "Type 2"],
    tariff_summary: "Rs 12/kWh",
    maps_url_type: "Coordinate navigation URL",
    coordinates: { latitude: 28.631, longitude: 77.219 },
    pricePerKwh: 12,
    powerLabel: "7.4 kW AC",
    availabilityLabel: "All busy",
    trustScore: 79,
    rating: 4.1,
    reviewCount: 89,
    etaMin: 35,
    amenities: ["Public access", "CCTV", "Parking"],
    connectorDetails: [
      { id: "AD01", type: "Bharat AC001", power: "7.4 kW AC", status: "Busy" },
      { id: "AD02", type: "Type 2", power: "22 kW AC", status: "Busy" }
    ],
    parkingFee: "NDMC rates",
    platformFee: 30,
    idleFee: "Rs 2/min after 10 min",
    hours: "Open Now",
    paymentMethods: ["UPI"]
  },
  {
    id: "demo-5",
    name: "Jio-bp Pulse",
    brand: "Jio-bp",
    area: "Sector 29, Gurugram",
    address: "Sector 29 Market, Gurugram",
    distance_km: 5.1,
    operational_status: "Open Now",
    verification_status: "High",
    demo_charging_enabled: true,
    demo_charger_id: "JB-S29-01",
    connector_summary: ["CCS2", "Type 2", "CHAdeMO"],
    tariff_summary: "Rs 20/kWh",
    maps_url_type: "Coordinate navigation URL",
    coordinates: { latitude: 28.468, longitude: 77.064 },
    pricePerKwh: 20,
    powerLabel: "60 kW DC",
    availabilityLabel: "3/5 free",
    trustScore: 91,
    rating: 4.5,
    reviewCount: 241,
    etaMin: 32,
    amenities: ["Food", "Parking", "Restrooms"],
    connectorDetails: [
      { id: "JB01", type: "CCS2", power: "60 kW DC", status: "Ready to charge" },
      { id: "JB02", type: "Type 2", power: "22 kW AC", status: "Ready to charge" }
    ],
    parkingFee: "Free",
    platformFee: 35,
    idleFee: "Rs 2/min after 10 min",
    hours: "Open Now",
    paymentMethods: ["Shubh Power Wallet", "UPI"]
  }
];

export const selectedStation = stations[0];

export const bookingDates = [
  { date: "Today", label: "18 Jul", selected: true },
  { date: "Fri", label: "19 Jul" },
  { date: "Sat", label: "20 Jul" },
  { date: "Sun", label: "21 Jul" }
];

export const bookingTimes = [
  { time: "09:00", free: "3 free" },
  { time: "09:30", free: "2 free" },
  { time: "10:00", free: "4 free", selected: true },
  { time: "10:30", free: "1 free" },
  { time: "11:00", free: "Full", disabled: true },
  { time: "11:30", free: "Full", disabled: true },
  { time: "12:00", free: "3 free" },
  { time: "12:30", free: "2 free" },
  { time: "13:00", free: "4 free" },
  { time: "14:00", free: "2 free" },
  { time: "14:30", free: "3 free" },
  { time: "15:00", free: "1 free" }
];

export const walletTransactions = [
  { title: "Charging - Sector 62", time: "Today 10:31 AM", amount: "-Rs 343", status: "Complete" },
  { title: "Refund - Booking cancel", time: "Today 09:12 AM", amount: "+Rs 466", status: "Refunded" },
  { title: "Added via UPI", time: "Yesterday 6:45 PM", amount: "+Rs 500", status: "Success" },
  { title: "Charging - DLF Mall", time: "16 Jul 3:22 PM", amount: "-Rs 218", status: "Complete" },
  { title: "Added via Card", time: "15 Jul 11:00 AM", amount: "+Rs 1000", status: "Success" }
];

export const chargingHistory = [
  { station: "Shubh Power EV Hub, Sector 62", time: "Today - 10:00 AM", amount: "Rs 343", status: "Complete", meta: "CCS2 - 14.2 kWh - 31 min" },
  { station: "DLF Mall, Sector 18", time: "16 Jul - 3:00 PM", amount: "Rs 218", status: "Complete", meta: "Type 2 - 10.8 kWh - 28 min" },
  { station: "Cyber Hub, Gurugram", time: "13 Jul - 2:00 PM", amount: "Rs 512", status: "Complete", meta: "CCS2 - 22.1 kWh - 22 min" },
  { station: "Connaught Place, Delhi", time: "10 Jul - 9:30 AM", amount: "Rs 98", status: "Failed", meta: "Type 2 - 5.2 kWh - 45 min" },
  { station: "Sector 29, Gurugram", time: "8 Jul - 6:00 PM", amount: "Rs 422", status: "Complete", meta: "CCS2 - 18.4 kWh - 19 min" }
];

export const supportTickets = [
  { id: "TKT-001", title: "CCS2 connector fault at Sector 62", status: "Resolved", meta: "12 Jul - 3 replies" },
  { id: "TKT-002", title: "UPI refund not received", status: "Open", meta: "12 Jul - 1 reply" }
];
