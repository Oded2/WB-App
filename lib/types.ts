type EnvelopePoint = {
  cg: number; // inches (chart X axis)
  weight: number; // lbs (chart Y axis)
};

type WeightBalanceChart = {
  name: string;
  envelope: EnvelopePoint[]; // vertices in order around the shape (closed implicitly)
};

// export type BaseValues = {
//   emptyWeight: number;
//   emptyArm: number;
//   maxFuel: number;
// };

type Arms = Record<string, number>;

export type Aircraft = {
  id: number;
  registration: string;
  type: string;
  emptyWeight: number;
  emptyArm: number;
  maxFuel: number;
  arms: Arms;
  chart: WeightBalanceChart;
};
