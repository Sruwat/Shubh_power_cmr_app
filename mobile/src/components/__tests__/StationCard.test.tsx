import { render } from "@testing-library/react-native";
import { StationCard } from "../StationCard";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

test("shows customer charging availability badge", () => {
  const station = {
    id: "s1",
    name: "Shubh Demo",
    brand: "Shubh Power",
    operational_status: "Demo simulated availability",
    verification_status: "demo",
    demo_charging_enabled: true,
    demo_charger_id: "SP-DEMO-001",
    connector_summary: ["CCS2"],
    maps_url_type: "search_url",
    coordinates: { latitude: 28.5, longitude: 77.3 }
  };
  const screen = render(<StationCard station={station} />);
  expect(screen.getByText("Charging available")).toBeTruthy();
});
