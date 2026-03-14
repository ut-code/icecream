import { useNavigate } from "react-router";
import { STAGES } from "~/stages";

export default function selectStage() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full bg-amber-100">
      <button className="bg-orange-400" onClick={() => navigate("/")}>
        ←戻る
      </button>
      <h1 className="text-center">ステージ選択</h1>
      {Array.from({ length: Object.keys(STAGES).length }, (_, k) => (
        <button
          className="bg-orange-400"
          onClick={() => navigate(`/stage/${k + 1}`)}
        >
          {k + 1}
        </button>
      ))}
    </div>
  );
}
