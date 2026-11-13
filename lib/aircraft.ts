import { notFound } from "next/navigation";
import { supabase } from "./supabase";
import type { Aircraft } from "./types";
import { cacheLife } from "next/cache";

export async function getAircraft(registration: string): Promise<Aircraft> {
  "use cache";
  cacheLife("hours");
  const { data, error } = await supabase
    .from("aircrafts")
    .select(
      "id, registration, type, emptyWeight:empty_weight, emptyArm:empty_arm, maxFuel:max_fuel, arms, chart, verified, imageUrl:image_url",
    )
    .eq("registration", registration)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();
  return data as Aircraft;
}
