import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAircraft } from "@/lib/aircraft";
import AircraftComponent from "@/components/AircraftComponent";

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
  if (!aircraft) notFound();
  return <AircraftComponent aircraft={aircraft} />;
}
