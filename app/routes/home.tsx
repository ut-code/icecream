import { useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "アイスクリームゲーム" },
    {
      name: "description",
      content: "アルゴリズムを組んでアイスを手に入れよう！",
    },
  ];
}

const bubbles = [
  { color: "#fbb6ce", size: 300, top: "10%", left: "10%", duration: "10s", delay: "0s" },
  { color: "#a7f3d0", size: 250, top: "60%", left: "70%", duration: "12s", delay: "2s" },
  { color: "#bfdbfe", size: 280, top: "30%", left: "80%", duration: "9s", delay: "1s" },
  { color: "#fde68a", size: 220, top: "70%", left: "20%", duration: "11s", delay: "3s" },
  { color: "#ddd6fe", size: 200, top: "5%", left: "50%", duration: "13s", delay: "0.5s" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-pink-100 via-yellow-50 to-sky-100">
      {/* Pastel bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            background: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            "--duration": b.duration,
            "--delay": b.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="mb-2 text-5xl tracking-wide text-pink-500 drop-shadow-md"
          style={{ fontFamily: "'DotGothic16', monospace" }}
        >
          アイスクリームゲーム
        </h1>

        <p
          className="mb-12 text-lg text-gray-600"
          style={{ fontFamily: "'DotGothic16', monospace" }}
        >
          アルゴリズムを組んでアイスを手に入れよう！
        </p>

        <div className="flex flex-col gap-4">
          <button
            className="pixel-btn"
            onClick={() => navigate("/select-stage")}
          >
            スタート
          </button>
          <button
            className="pixel-btn pixel-btn-secondary"
            onClick={() => alert("準備中")}
          >
            あそびかた
          </button>
        </div>
      </div>
    </div>
  );
}
