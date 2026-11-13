import Aircraft from "@/components/AircraftComponent";
import { Arms, BaseValues, WeightBalanceChart } from "@/lib/types";

const dummyChart: WeightBalanceChart = {
  name: "Cessna 172S, Normal Category",
  envelope: [
    { cg: 35.0, weight: 1500 },
    { cg: 35.0, weight: 1950 },
    { cg: 41.0, weight: 2550 },
    { cg: 47.3, weight: 2550 },
    { cg: 47.3, weight: 1500 },
  ],
};

const dummyBaseValues: BaseValues = {
  emptyWeight: 1663,
  emptyArm: 39,
  maxFuel: 240,
};

const dummyArms: Arms = {
  "Front Seats": 37.0,
  "Rear Seats": 73.0,
  "Front Baggage": 95,
  "Rear Baggage": 123.0,
  Fuel: 48.0,
};

export default function Page() {
  return (
    <Aircraft
      baseValues={dummyBaseValues}
      arms={dummyArms}
      chart={dummyChart}
      aircraftType="Cessna 172"
      registration="4X-CAU"
    />
  );
}
