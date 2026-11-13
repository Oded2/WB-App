type EnvelopePoint = {
  cg: number;
  weight: number;
};

type Arms = Record<string, number>;

export type WeightBalanceChart = {
  name: string;
  envelope: EnvelopePoint[];
};

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
