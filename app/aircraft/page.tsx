import Aircraft from "@/components/AircraftComponent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Aircraft></Aircraft>
    </Suspense>
  );
}
