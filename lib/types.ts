type EnvelopePoint = {
  cg: number; // inches (chart X axis)
  weight: number; // lbs (chart Y axis)
};

export type WeightBalanceChart = {
  name: string;
  envelope: EnvelopePoint[]; // vertices in order around the shape (closed implicitly)
};
