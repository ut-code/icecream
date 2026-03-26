import { STAGES, type Component } from "~/stages";
import type { Route } from "./+types/stage.$id";
import { useNavigate } from "react-router";
import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  type Node,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ConeColor, Flavor } from "~/stages";
import { icemake, type ComponentGraphNode } from "~/lib/icemake";

let id = 0;
const getId = () => `node_${id++}`;

type AppNode = Node<{ label: string | React.ReactNode }>;

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

function StageInner({
  stageId,
  stageData,
}: {
  stageId: number;
  stageData: any;
}) {
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
    { id: "start", position: { x: 0, y: 50 }, data: { label: "始点" } },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [isClear, setIsClear] = useState(false);
  const [failMessage, setFailMessage] = useState("");

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragStart = (e: React.DragEvent, componentData: string) => {
    e.dataTransfer.setData("application/reactflow", componentData);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const dataStr = e.dataTransfer.getData("application/reactflow");
      if (!dataStr) return;

      const component: Component = JSON.parse(dataStr);

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode: AppNode = {
        id: getId(),
        type: "default",
        position,
        data: {
          label: (
            <div className="flex flex-col items-center">
              <span className="font-bold text-xs">
                {component.type.toUpperCase()}
              </span>
              <span className="text-[10px]">
                {(component as any).flavor || (component as any).color || ""}
              </span>
            </div>
          ),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const handleExecute = () => {
    let firstComponentId = 3;
    let components: Record<number, ComponentGraphNode> = {
      0: { coord: { x: 1, y: 1 }, childrenIds: 4 },
      1: { coord: { x: 2, y: 1 }, childrenIds: null },
      2: { coord: { x: 1, y: 2 }, childrenIds: 0 },
      3: { coord: { x: 0, y: 0 }, childrenIds: { true: 0, false: 2 } },
      4: { coord: { x: 2, y: 2 }, childrenIds: { true: 1, false: null } },
    };

    const colors = Object.keys(stageData.mission) as ConeColor[];
    const result = icemake(colors, stageId, components, firstComponentId);
    if (checkClear(stageData.mission, result)) {
      setIsClear(true);
      setFailMessage("");
    } else {
      setIsClear(false);
      setFailMessage("不一致です。もう一度試してください。");
    }
  };

  const nextStageExists = STAGES[stageId + 1] !== undefined;

  const handleNavigate = (path: string) => {
    setIsClear(false);
    setFailMessage("");
    navigate(path);
  };

  return (
    <div className="w-full h-full bg-amber-100 flex flex-col overflow-hidden relative">
      <div className="flex-none p-2 flex items-start gap-4">
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

      <div className="grow relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>

      <div className="bg-amber-50 h-32 flex items-center gap-4 px-4 overflow-x-auto border-t-2 border-orange-200 flex-none">
        {stageData.components.map((component: any, index: number) => {
          let src = "";
          if (component.type === "push") {
            src = `/push_${component.flavor}.png`;
          } else if (component.type === "pop") {
            src = `/pop_${component.flavor}.png`;
          } else if (component.type === "if") {
            src = `/if_true.png`;
          }

          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e, JSON.stringify(component))}
              className="h-24 w-24 shrink-0 bg-white rounded-lg shadow-md flex items-center justify-center relative cursor-grab active:cursor-grabbing hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-orange-300"
            >
              {src ? (
                <img
                  src={src}
                  alt={component.type}
                  className="h-20 pointer-events-none"
                />
              ) : (
                <span className="text-xs font-bold pointer-events-none">
                  {component.type}
                </span>
              )}
              {component.type === "if" && (
                <img
                  src={`/cone_${component.color}.png`}
                  alt={component.color}
                  className="absolute bottom-14 left-3 h-6 pointer-events-none"
                />
              )}
            </div>
          );
        })}
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
                  onClick={() => handleNavigate(`/stage/${stageId + 1}`)}
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

export default function Stage({ params }: Route.ComponentProps) {
  const stageId = Number(params.id);
  const stageData = STAGES[stageId];
  const navigate = useNavigate();

  if (!stageData) {
    return (
      <div className="w-full h-full bg-amber-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">
            ステージが見つかりませんでした
          </p>
          <button
            className="bg-orange-400 px-4 py-2 rounded text-white"
            onClick={() => navigate("/select-stage")}
          >
            ステージ選択へ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <StageInner stageId={stageId} stageData={stageData} />
    </ReactFlowProvider>
  );
}
