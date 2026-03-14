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

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full bg-amber-100">
      <h1 className="text-center">アイスクリームゲーム</h1>
      <button
        className="bg-orange-400"
        onClick={() => navigate("/select-stage")}
      >
        スタート
      </button>
    </div>
  );
}
