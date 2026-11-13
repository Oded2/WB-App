import { Suspense } from "react";
import { notFound } from "next/navigation";
import Aircraft from "@/components/AircraftComponent";
import { getAircraft } from "@/lib/aircraft";

type SearchParams = Promise<{ registration?: string | string[] }>;

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<p>Loading aircraft…</p>}>
      <AircraftLoader searchParams={searchParams} />
    </Suspense>
  );
}

async function AircraftLoader({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { registration } = await searchParams;
  const reg = Array.isArray(registration) ? registration[0] : registration;
  if (!reg) notFound();
  const aircraft = await getAircraft(reg.toLowerCase());
  console.log(aircraft);
  if (!aircraft) notFound();
  return <Aircraft aircraft={aircraft} />;
}
