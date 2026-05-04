import { useNavigate } from "react-router";
import { bubbles } from "~/bubbles";

const TOTAL_STAGES = 20;

const PATH_WIDTH = 1100;
const CENTER_X = PATH_WIDTH / 2;
const AMPLITUDE = 500;
const FREQ = 6;
const PATH_HEIGHT = 1500;

// Anchor points: sine wave sampled at each stage's vertical position
const ANCHORS: { x: number; y: number }[] = [];
for (let i = 0; i < TOTAL_STAGES; i++) {
  const t = i / (TOTAL_STAGES - 1);
  ANCHORS.push({
    x: CENTER_X + AMPLITUDE * Math.sin(t * Math.PI * FREQ),
    y: 20 + t * PATH_HEIGHT,
  });
}

function bezierControlY(y0: number, y1: number): number {
  return (y0 + y1) / 2;
}

function bezierPoint(segIdx: number, t: number): { x: number; y: number } {
  const p0 = ANCHORS[segIdx];
  const p1 = ANCHORS[segIdx + 1];
  const cpY = bezierControlY(p0.y, p1.y);
  const u = 1 - t;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * t * p0.x +
      3 * u * t * t * p1.x +
      t * t * t * p1.x,
    y:
      u * u * u * p0.y +
      3 * u * u * t * cpY +
      3 * u * t * t * cpY +
      t * t * t * p1.y,
  };
}

// Arc-length table along the full bezier path
const SAMPLES_PER_SEG = 100;
const NUM_SEGS = TOTAL_STAGES - 1;
const TOTAL_SAMPLES = NUM_SEGS * SAMPLES_PER_SEG;

const arcLengths: number[] = [0];
let prevPt = ANCHORS[0];
for (let i = 1; i <= TOTAL_SAMPLES; i++) {
  const seg = Math.floor((i - 1) / SAMPLES_PER_SEG);
  const localT = (i - seg * SAMPLES_PER_SEG) / SAMPLES_PER_SEG;
  const pt = bezierPoint(seg, localT);
  const dx = pt.x - prevPt.x;
  const dy = pt.y - prevPt.y;
  arcLengths.push(arcLengths[i - 1] + Math.sqrt(dx * dx + dy * dy));
  prevPt = pt;
}
const totalArcLength = arcLengths[TOTAL_SAMPLES];

function pointAtArcLength(target: number): { x: number; y: number } {
  let lo = 0;
  let hi = TOTAL_SAMPLES;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arcLengths[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (lo === 0) return ANCHORS[0];
  const frac =
    (target - arcLengths[lo - 1]) / (arcLengths[lo] - arcLengths[lo - 1]);
  const globalT = lo - 1 + frac;
  const seg = Math.floor(globalT / SAMPLES_PER_SEG);
  const localT = (globalT - seg * SAMPLES_PER_SEG) / SAMPLES_PER_SEG;
  return bezierPoint(Math.min(seg, NUM_SEGS - 1), localT);
}

// Precompute all stage positions
const stagePositions = Array.from({ length: TOTAL_STAGES }, (_, i) => {
  if (i === 0) return ANCHORS[0];
  if (i === TOTAL_STAGES - 1) return ANCHORS[ANCHORS.length - 1];
  const target = (i / (TOTAL_STAGES - 1)) * totalArcLength;
  return pointAtArcLength(target);
});

// Precompute SVG path
const pathD = (() => {
  let d = `M ${ANCHORS[0].x} ${ANCHORS[0].y}`;
  for (let i = 1; i < ANCHORS.length; i++) {
    const prev = ANCHORS[i - 1];
    const curr = ANCHORS[i];
    const cpY = bezierControlY(prev.y, curr.y);
    d += ` C ${prev.x} ${cpY}, ${curr.x} ${cpY}, ${curr.x} ${curr.y}`;
  }
  return d;
})();

const contentHeight = stagePositions[TOTAL_STAGES - 1].y + 80;

const personDecorations = [
  {
    src: "/if_false.png",
    alt: "If False Character",
    stageIndex: 8,
    width: 76,
    offsetX: 50,
    offsetY: -100,
  },
  {
    src: "/if_true.png",
    alt: "If True Character",
    stageIndex: 19,
    width: 76,
    offsetX: 40,
    offsetY: -150,
  },
  {
    src: "/pop_vanilla.png",
    alt: "Pop Vanilla Character",
    stageIndex: 0,
    width: 64,
    offsetX: 40,
    offsetY: -80,
  },
  {
    src: "/pop_strawberry.png",
    alt: "Pop Strawberry Character",
    stageIndex: 16,
    width: 64,
    offsetX: 40,
    offsetY: -120,
  },
  {
    src: "/pop_chocolate.png",
    alt: "Pop Chocolate Character",
    stageIndex: 10,
    width: 64,
    offsetX: 40,
    offsetY: -120,
  },
  {
    src: "/push_vanilla.png",
    alt: "Push Vanilla Character",
    stageIndex: 13,
    width: 72,
    offsetX: 40,
    offsetY: -120,
  },
  {
    src: "/push_strawberry.png",
    alt: "Push Strawberry Character",
    stageIndex: 3,
    width: 72,
    offsetX: 20,
    offsetY: -150,
  },
  {
    src: "/push_chocolate.png",
    alt: "Push Chocolate Character",
    stageIndex: 6,
    width: 64,
    offsetX: 40,
    offsetY: -120,
  },
];

export default function SelectStage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center">
      <div className="fixed inset-0 z-0 bg-linear-to-b from-pink-100 via-yellow-50 to-sky-100" />
      {bubbles.map((b) => (
        <div
          key={b.color}
          className="bubble"
          style={
            {
              position: "fixed",
              background: b.color,
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              "--duration": b.duration,
              "--delay": b.delay,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Back button */}
      <div className="relative z-10 mt-6 w-full px-4">
        <button
          type="button"
          className="pixel-btn pixel-btn-small"
          onClick={() => navigate("/")}
        >
          ← もどる
        </button>
      </div>
      {/* Title */}
      <h1
        className="relative z-10 mt-4 text-center text-3xl tracking-wide text-pink-600 drop-shadow-md"
        style={{ fontFamily: "'DotGothic16', monospace" }}
      >
        ステージ選択
      </h1>

      {/* Snake path with stage buttons */}
      <div
        className="relative z-10 mx-auto mt-20 mb-24"
        style={{ width: PATH_WIDTH, height: contentHeight }}
      >
        <svg
          role="img"
          aria-label="Stage path"
          className="absolute inset-0"
          width={PATH_WIDTH}
          height={contentHeight}
          viewBox={`0 0 ${PATH_WIDTH} ${contentHeight}`}
          fill="none"
        >
          <path
            d={pathD}
            stroke="#c8956c"
            strokeWidth={4}
            strokeDasharray="10 8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {personDecorations.map((decor, index) => {
        const pos = stagePositions[decor.stageIndex];
        return (
          <img
            key={`person-decor-${index}`}
            src={decor.src}
            alt={decor.alt}
            className="pointer-events-none absolute z-0 opacity-90"
            style={{
              position: "absolute",
              width: decor.width,
              left: pos.x + decor.offsetX,
              top: pos.y + decor.offsetY,
            }}
          />
        );
      })}

        {stagePositions.map((pos, i) => {
          const stageNum = i + 1;
          return (
            <div
              key={`stage-${stageNum}`}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                type="button"
                className="stage-btn"
                onClick={() => navigate(`/stage/${stageNum}`)}
              >
                {stageNum}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
