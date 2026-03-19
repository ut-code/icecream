import { useState } from "react";
import { useNavigate } from "react-router";
import type { ConeColor, Flavor } from "~/stages";
import { STAGES } from "~/stages";
import type { Route } from "./+types/stage.$id";

function checkClear(
	mission: Partial<Record<ConeColor, Flavor[]>>,
	result: Partial<Record<ConeColor, Flavor[]>>,
): boolean {
	for (const [color, expected] of Object.entries(mission) as [
		ConeColor,
		Flavor[],
	][]) {
		const actual = result[color];
		if (!actual) return false;
		if (expected.length !== actual.length) return false;
		for (let i = 0; i < expected.length; i++) {
			if (expected[i] !== actual[i]) return false;
		}
	}
	return true;
}

export default function Stage({ params }: Route.ComponentProps) {
	const navigate = useNavigate();
	const id = Number(params.id);
	const stageData = STAGES[id];
	const [isClear, setIsClear] = useState(false);
	const [failMessage, setFailMessage] = useState("");

	const handleExecute = () => {
		// Mock: return mission as-is (will be replaced by real algorithm)
		const result = stageData.mission;
		if (checkClear(stageData.mission, result)) {
			setIsClear(true);
			setFailMessage("");
		} else {
			setIsClear(false);
			setFailMessage("不一致です。もう一度試してください。");
		}
	};

	const nextStageExists = STAGES[id + 1] !== undefined;

	const handleNavigate = (path: string) => {
		setIsClear(false);
		setFailMessage("");
		navigate(path);
	};

	return (
		<div className="w-full h-full bg-amber-100 relative">
			<div className="flex items-start gap-4 p-2">
				<button
					type="button"
					className="pixel-btn pixel-btn-small"
					onClick={() => handleNavigate("/select-stage")}
				>
					← もどる
				</button>

				{/* Mission display */}
				<div className="bg-white/80 rounded-lg p-3 border-2 border-gray-400 text-gray-800">
					<div className="font-[DotGothic16] text-sm mb-2">おだい</div>
					<div className="font-[DotGothic16] text-sm">
						{(Object.entries(stageData.mission) as [ConeColor, Flavor[]][]).map(
							([color, flavors]) => (
								<div key={color}>
									{color}: {flavors.join(", ")}
								</div>
							),
						)}
					</div>
				</div>
			</div>

			{/* Execute button */}
			<div className="absolute bottom-6 right-6">
				<button type="button" className="pixel-btn" onClick={handleExecute}>
					実行
				</button>
			</div>

			{/* Fail message */}
			{failMessage && (
				<div className="absolute bottom-20 right-6 bg-red-200 border-2 border-red-500 px-4 py-2 rounded font-[DotGothic16]">
					{failMessage}
				</div>
			)}

			{/* Clear overlay */}
			{isClear && (
				<div className="clear-overlay">
					<div className="clear-modal">
						<div className="font-[DotGothic16] text-4xl mb-6 text-gray-800">
							クリア！
						</div>
						<div className="flex flex-col gap-3">
							{nextStageExists && (
								<button
									type="button"
									className="pixel-btn"
									onClick={() => handleNavigate(`/stage/${id + 1}`)}
								>
									次のステージへ →
								</button>
							)}
							<button
								type="button"
								className="pixel-btn pixel-btn-secondary"
								onClick={() => handleNavigate("/select-stage")}
							>
								ステージ選択にもどる
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
