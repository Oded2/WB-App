"use client";

import { Arms, BaseValues, WeightBalanceChart } from "@/lib/types";
import { WeightBalanceGraph } from "./WeightBalanceChart";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";
import { isValidNumber } from "@/lib/utils";

type Props = {
  baseValues: BaseValues;
  aircraftType: string;
  registration: string;
  arms: Arms;
  chart: WeightBalanceChart;
};

export default function Aircraft({
  baseValues,
  arms,
  chart,
  aircraftType,
  registration,
}: Props) {
  const armsSorted = Object.entries(arms).sort(([_a1, a], [_b2, b]) => a - b);
  const [weights, setWeights] = useState<number[]>(
    Array(armsSorted.length).fill(0),
  );

  const updateWeight = (index: number, newWeight: number) => {
    setWeights((prev) => prev.map((w, i) => (i === index ? newWeight : w)));
  };

  const totalWeight =
    baseValues.emptyWeight + weights.reduce((sum, w) => sum + w, 0);
  const totalMoment =
    baseValues.emptyWeight * baseValues.emptyArm +
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
      <div className="mt-4 flex items-stretch justify-center gap-20">
        <div className="flex flex-col gap-2 rounded-lg bg-slate-200 p-5">
          {armsSorted.map(([itemName], index) => (
            <div key={index} className="flex flex-col gap-2">
              <label htmlFor={index.toString()}>
                {itemName.toLowerCase().includes("fuel")
                  ? `${itemName} (gallons)`
                  : itemName}
              </label>
              <input
                type="number"
                id={index.toString()}
                placeholder="0"
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
                weights[index] > baseValues.maxFuel && (
                  <span className="text-xs text-red-400">
                    {`Fuel exceeds maximum amount (${(baseValues.maxFuel / 6).toLocaleString()} gallons)`}
                  </span>
                )}
            </div>
          ))}
        </div>
        <div className="flex flex-col-reverse gap-5">
          <div className="flex min-h-5 w-lg justify-between gap-4 overflow-auto rounded-2xl bg-slate-200 p-5 text-nowrap">
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
          <div className="flex justify-center">
            {/* Ensures that the weight and balance graph doesn't render if the weight exceeds the maximum weight by over a reasonable amount
            Done to prevent crashes since the weight and balance graph is heavy */}
            {totalWeight <
            chart.envelope[chart.envelope.length - 2].weight * 5 ? (
              <WeightBalanceGraph chart={chart} cg={cg} weight={totalWeight} />
            ) : (
              <span>Maximum takeoff weight is way too high</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
