"use client";

import { WeightBalanceChart } from "@/lib/types";
import { WeightBalanceGraph } from "./WeightBalanceChart";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";
import { isValidNumber } from "@/lib/utils";

type BaseValues = {
  emptyWeight: number;
  emptyArm: number;
  maxFuel: number;
};

type Arms = Record<string, number>;

type Props = {
  baseValues?: BaseValues;
  aircraftType: string;
  registration: string;
  arms?: Arms;
  chart?: WeightBalanceChart;
};

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

export default function Aircraft({ aircraftType, registration }: Props) {
  const armsSorted = Object.entries(dummyArms).sort(
    ([_a1, a], [_b2, b]) => a - b,
  );
  const [weights, setWeights] = useState<number[]>(
    Array(armsSorted.length).fill(0),
  );

  const updateWeight = (index: number, newWeight: number) => {
    setWeights((prev) => prev.map((w, i) => (i === index ? newWeight : w)));
  };

  const totalWeight =
    dummyBaseValues.emptyWeight + weights.reduce((sum, w) => sum + w, 0);
  const totalMoment =
    dummyBaseValues.emptyWeight * dummyBaseValues.emptyArm +
    weights.reduce((sum, w, i) => sum + w * armsSorted[i][1], 0);
  const cg = totalWeight > 0 ? totalMoment / totalWeight : 0;
  return (
    <>
      <Link href="/" className="absolute max-w-24">
        <Button>Home</Button>
      </Link>
      <div className="mx-auto flex flex-col">
        <h4 className="text-xl italic">{aircraftType}</h4>
        <h1 className="text-8xl font-bold">{registration}</h1>
      </div>
      <div className="mt-4 flex justify-around gap-8">
        <div className="flex flex-col gap-2 rounded-lg bg-slate-200 p-5">
          {armsSorted.map(([itemName], index) => (
            <div key={index} className="flex flex-col gap-2">
              <label htmlFor={index.toString()}>{itemName}</label>
              <input
                type="number"
                id={index.toString()}
                placeholder="0lbs"
                onInput={(e) => {
                  const {
                    currentTarget: { value },
                  } = e;
                  if (isValidNumber(value))
                    updateWeight(index, Number(e.currentTarget.value));
                  else if (value.length == 0) updateWeight(index, 0);
                }}
                className="rounded-lg bg-slate-300 p-2 ring-blue-300 transition-all outline-none focus:ring-2"
              />
              {itemName.toLowerCase() === "fuel" &&
                weights[index] > dummyBaseValues.maxFuel && (
                  <span className="text-xs text-red-400">
                    Fuel exceeds maximum amount
                  </span>
                )}
            </div>
          ))}
        </div>
        <div className="flex flex-col-reverse gap-5">
          <div className="flex w-full flex-col">
            <div className="flex min-h-5 w-full justify-between gap-4 rounded-2xl bg-slate-200 p-5">
              {armsSorted.map(([itemName, itemInfo], index) => (
                <div
                  key={index}
                  className="flex flex-col rounded bg-slate-300 px-5 py-3 transition-shadow hover:shadow"
                >
                  <span className="text-sm text-slate-800">{itemName}</span>
                  <span className="text-xs text-slate-600">{`Weight: ${weights[index].toLocaleString()}lbs`}</span>
                  <span className="text-xs text-slate-600">{`Arm: ${armsSorted[index][1].toLocaleString()}in`}</span>
                  <span className="text-xs text-slate-600">{`Moment: ${(weights[index] * armsSorted[index][1]).toLocaleString()}`}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            {/* Ensures that the weight and balance graph doesn't render if the weight exceeds the maximum weight by over a reasonable amount
            Done to prevent crashes since the weight and balance graph is heavy */}
            {totalWeight <
            dummyChart.envelope[dummyChart.envelope.length - 2].weight * 5 ? (
              <WeightBalanceGraph
                chart={dummyChart}
                cg={cg}
                weight={totalWeight}
              />
            ) : (
              <span>Maximum takeoff weight is way too high</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
