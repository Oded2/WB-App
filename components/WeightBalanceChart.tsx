import { WeightBalanceChart } from "@/lib/types";

type Props = {
  chart: WeightBalanceChart;
  cg: number; // inches
  weight: number; // lbs
};

const W = 400;
const H = 300;
const PAD = { top: 12, right: 16, bottom: 36, left: 52 };

const range = (min: number, max: number, step: number) => {
  const out: number[] = [];
  for (let v = min; v <= max; v += step) out.push(v);
  return out;
};

const isWithinEnvelope = (
  cg: number,
  weight: number,
  chart: WeightBalanceChart,
): boolean => {
  const pts = chart.envelope;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    const crosses =
      a.weight > weight !== b.weight > weight &&
      cg < ((b.cg - a.cg) * (weight - a.weight)) / (b.weight - a.weight) + a.cg;
    if (crosses) inside = !inside;
  }
  return inside;
};

export function WeightBalanceGraph({ chart, cg, weight }: Props) {
  const xs = chart.envelope.map((p) => p.cg);
  const ys = chart.envelope.map((p) => p.weight);

  // Axis bounds include the point, so it still shows when out of limits
  const xMin = Math.floor(Math.min(...xs, cg) - 1);
  const xMax = Math.ceil(Math.max(...xs, cg) + 1);
  const yMin = Math.floor((Math.min(...ys, weight) - 50) / 100) * 100;
  const yMax = Math.ceil((Math.max(...ys, weight) + 50) / 100) * 100;

  const sx = (v: number) =>
    PAD.left + ((v - xMin) / (xMax - xMin)) * (W - PAD.left - PAD.right);
  const sy = (v: number) =>
    H - PAD.bottom - ((v - yMin) / (yMax - yMin)) * (H - PAD.top - PAD.bottom);

  const polygon = chart.envelope
    .map((p) => `${sx(p.cg)},${sy(p.weight)}`)
    .join(" ");
  const inside = isWithinEnvelope(cg, weight, chart);

  return (
    <div className="w-full max-w-lg rounded-lg bg-slate-200 p-4 shadow-lg">
      <h3 className="mb-2 text-sm font-medium text-slate-200">{chart.name}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        {/* Grid + X ticks */}
        {range(xMin, xMax, 2).map((v) => (
          <g key={`x${v}`}>
            <line
              x1={sx(v)}
              x2={sx(v)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-slate-300"
            />
            <text
              x={sx(v)}
              y={H - PAD.bottom + 14}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Grid + Y ticks */}
        {range(yMin, yMax, 200).map((v) => (
          <g key={`y${v}`}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={sy(v)}
              y2={sy(v)}
              className="stroke-slate-300"
            />
            <text
              x={PAD.left - 6}
              y={sy(v) + 3}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        <text
          x={(PAD.left + W - PAD.right) / 2}
          y={H - 4}
          textAnchor="middle"
          className="fill-slate-400 text-[10px]"
        >
          CG (in)
        </text>
        <text
          transform={`translate(12 ${(PAD.top + H - PAD.bottom) / 2}) rotate(-90)`}
          textAnchor="middle"
          className="fill-slate-400 text-[10px]"
        >
          Weight (lbs)
        </text>

        {/* Envelope */}
        <polygon
          points={polygon}
          className="fill-sky-500/20 stroke-sky-400"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Current point */}
        <circle
          cx={sx(cg)}
          cy={sy(weight)}
          r={5}
          className={`stroke-white ${inside ? "fill-emerald-400" : "fill-red-500"}`}
          strokeWidth={1.5}
        />
      </svg>

      <p
        className={`mt-2 text-sm ${inside ? "text-emerald-400" : "text-red-400"}`}
      >
        {weight.toLocaleString("en-US", { maximumFractionDigits: 0 })}lbs @{" "}
        {cg.toFixed(1)}in: {inside ? "within limits" : "out of limits"}
      </p>
    </div>
  );
}
