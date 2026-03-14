import { STAGES } from "~/stages";
import type { Route } from "./+types/stage.$id";
import { useNavigate } from "react-router";

export default function stage({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const stageData = STAGES[Number(params.id)];
  return (
    <div className="w-full h-full bg-amber-100">
      <button
        className="bg-orange-400"
        onClick={() => navigate("/select-stage")}
      >
        ←戻る
      </button>
      <div>{JSON.stringify(stageData)}</div>
    </div>
  );
}
