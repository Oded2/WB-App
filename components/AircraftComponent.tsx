"use client";

import { Aircraft } from "@/lib/types";
import { WeightBalanceGraph } from "./WeightBalanceChart";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";
import { isValidNumber } from "@/lib/utils";

type Props = {
  aircraft: Aircraft;
};

export default function AircraftComponent({ aircraft }: Props) {
  const armsSorted = Object.entries(aircraft.arms).sort((a, b) => a[1] - b[1]);
  const [weights, setWeights] = useState<number[]>(
    Array(armsSorted.length).fill(0),
  );

  const updateWeight = (index: number, newWeight: number) => {
    setWeights((prev) => prev.map((w, i) => (i === index ? newWeight : w)));
  };

  const totalWeight =
    aircraft.emptyWeight + weights.reduce((sum, w) => sum + w, 0);
  const totalMoment =
    aircraft.emptyWeight * aircraft.emptyArm +
    weights.reduce((sum, w, i) => sum + w * armsSorted[i][1], 0);
  const cg = totalWeight > 0 ? totalMoment / totalWeight : 0;
  return (
    <>
      <Link href="/" className="absolute max-w-24">
        <Button>Home</Button>
      </Link>
      <div className="mx-auto flex flex-col">
        <div className="flex justify-between gap-2">
          <h4 className="text-xl italic">{aircraft.type}</h4>
          {aircraft.verified && (
            <span className="mt-auto text-xs text-emerald-400 italic">
              Verified
            </span>
          )}
        </div>
        <h1 className="text-8xl font-bold">
          {aircraft.registration.toUpperCase()}
        </h1>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-lg font-medium">Aircraft Details</h2>
          <div className="flex max-h-140 gap-3 rounded-lg bg-slate-200 py-5 ps-3 pe-5">
            <div className="flex flex-col gap-2 overflow-auto">
              {armsSorted.map(([itemName], index) => (
                <div key={index} className="m-2 flex flex-col gap-2">
                  <label htmlFor={index.toString()}>
                    {itemName.toLowerCase().includes("fuel")
                      ? `${itemName} (gallons)`
                      : itemName}
                  </label>
                  <input
                    type="number"
                    id={index.toString()}
                    placeholder={`0 ${itemName.toLowerCase().includes("fuel") ? "gal" : "lbs"}`}
                    onInput={(e) => {
                      const {
                        currentTarget: { value },
                      } = e;
                      if (isValidNumber(value))
                        updateWeight(
                          index,
                          itemName.toLowerCase().includes("fuel")
                            ? Number(value) * 6
                            : Number(value),
                        );
                      else if (value.length == 0) updateWeight(index, 0);
                    }}
                    className="rounded-lg bg-slate-300 p-2 ring-blue-300 transition-all outline-none focus:ring-2"
                  />
                  {itemName.toLowerCase().includes("fuel") &&
                    weights[index] > aircraft.maxFuel && (
                      <span className="text-xs text-red-400">
                        {`Fuel exceeds maximum amount (${(aircraft.maxFuel / 6).toLocaleString()} gallons)`}
                      </span>
                    )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 overflow-auto text-nowrap">
              <div className="flex flex-col rounded bg-slate-300 px-5 py-3 transition-shadow hover:shadow">
                <span className="text-sm text-slate-800">Empty Weight</span>
                <span className="text-xs text-slate-600">{`Weight: ${aircraft.emptyWeight.toLocaleString()}lbs`}</span>
                <span className="text-xs text-slate-600">{`Arm: ${aircraft.emptyArm.toLocaleString()}in`}</span>
                <span className="text-xs text-slate-600">{`Moment: ${(aircraft.emptyWeight * aircraft.emptyArm).toLocaleString()}`}</span>
              </div>
              {armsSorted.map(([armName], index) => (
                <div
                  key={index}
                  className="flex flex-col rounded bg-slate-300 px-5 py-3 transition-shadow hover:shadow"
                >
                  <span className="text-sm text-slate-800">{armName}</span>
                  <span className="text-xs text-slate-600">{`Weight: ${weights[index].toLocaleString()}lbs`}</span>
                  <span className="text-xs text-slate-600">{`Arm: ${armsSorted[index][1].toLocaleString()}in`}</span>
                  <span className="text-xs text-slate-600">{`Moment: ${(weights[index] * armsSorted[index][1]).toLocaleString()}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Ensures that the weight and balance graph doesn't render if the weight exceeds the maximum weight by over a reasonable amount
            Done to prevent crashes since the weight and balance graph is heavy */}
        {totalWeight <
        aircraft.chart.envelope[aircraft.chart.envelope.length - 2].weight *
          5 ? (
          <div className="flex w-full max-w-lg min-w-md flex-col gap-4">
            <h2 className="text-center text-lg font-medium">Loading Graph</h2>
            <WeightBalanceGraph
              chart={aircraft.chart}
              cg={cg}
              weight={totalWeight}
            />
            <span className="ms-auto text-xs text-slate-500">{`MTOW: ${aircraft.chart.envelope[aircraft.chart.envelope.length - 2].weight.toLocaleString()}lbs`}</span>
          </div>
        ) : (
          <span>Maximum takeoff weight is way too high</span>
        )}
      </div>
    </>
  );
}
