import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { bubbles } from "~/bubbles";

import type { ConeColor, Flavor } from "~/stages";

const coneImage: Record<ConeColor, string> = {
  red: "/cone_red.png",
  yellow: "/cone_yellow.png",
  brown: "/cone_brown.png",
};

const scoopImage: Record<Flavor, string> = {
  vanilla: "/ice_vanilla.png",
  chocolate: "/ice_chocolate.png",
  strawberry: "/ice_strawberry.png",
};

type IceCreamSpec = {
  x: string | number;
  y: string | number;
  cone: ConeColor;
  scoops: Flavor[];
};

function renderIceCream(spec: IceCreamSpec, index: number) {
  return (
    <div
      key={index}
      className="absolute z-0 pointer-events-none"
      style={{ top: spec.y, left: spec.x }}
    >
      <img
        src={coneImage[spec.cone]}
        alt={`Cone ${spec.cone}`}
        className="w-14 h-14"
      />
      {spec.scoops.map((flavor, scoopIndex) => (
        <img
          key={scoopIndex}
          src={scoopImage[flavor]}
          alt={`${flavor} scoop`}
          className="w-14 h-14 absolute left-0"
          style={{ top: -44 - scoopIndex * 32 }}
        />
      ))}
    </div>
  );
}

const iceCreams : IceCreamSpec[] = [
  { x: "calc(50% + 270px)", y: "40%", cone: "red", scoops: ["vanilla","strawberry", "chocolate"] },
  { x: "calc(50% - 330px)", y: "40%", cone: "yellow", scoops: ["vanilla","chocolate", "strawberry"] },
  { x: "calc(50% + 130px)", y: "65%", cone: "yellow", scoops: ["chocolate","vanilla", "strawberry"] },
  { x: "calc(50% - 190px)", y: "65%", cone: "brown", scoops: ["strawberry","chocolate", "vanilla"] },
  { x: "24px", y: "calc(100% - 72px)", cone: "red", scoops: ["vanilla", "chocolate", "chocolate","strawberry", "strawberry"] },
  { x: "25%", y: "calc(100% - 72px)", cone: "brown", scoops: ["strawberry", "vanilla", "chocolate"] },
  { x: "50%", y: "calc(100% - 72px)", cone: "yellow", scoops: ["chocolate"] },
  { x: "75%", y: "calc(100% - 72px)", cone: "red", scoops: ["chocolate", "strawberry", "vanilla"] },
  { x: "calc(100% - 72px)", y: "calc(100% - 72px)", cone: "brown", scoops: ["strawberry", "strawberry", "chocolate", "vanilla", "strawberry"] },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "アイスクリームゲーム" },
    {
      name: "description",
      content: "アルゴリズムを組んでアイスを手に入れよう！",
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-pink-100 via-yellow-50 to-sky-100">
      {/* Pastel bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble"
          style={
            {
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

      {/* Ice cream decorations */}
      {iceCreams.map(renderIceCream)}

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
            onClick={() => navigate("/how-to-play")}
          >
            あそびかた
          </button>
        </div>
      </div>
    </div>
  );
}
