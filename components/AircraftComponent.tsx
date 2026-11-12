"use client";

import { useSearchParams } from "next/navigation";

export default function Aircraft() {
  const params = useSearchParams();
  const num = params.get("registration");
  return <div>{num}</div>;
}
