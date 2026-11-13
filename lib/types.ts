type EnvelopePoint = {
  cg: number; // inches (chart X axis)
  weight: number; // lbs (chart Y axis)
};

export type WeightBalanceChart = {
  name: string;
  envelope: EnvelopePoint[]; // vertices in order around the shape (closed implicitly)
};

export type BaseValues = {
  emptyWeight: number;
  emptyArm: number;
  maxFuel: number;
};

export type Arms = Record<string, number>;
