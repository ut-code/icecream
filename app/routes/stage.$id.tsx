import { STAGES, type Component } from "~/stages";
import type { Route } from "./+types/stage.$id";
import { useNavigate } from "react-router";
import { useCallback, useRef } from "react";
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

let id = 0;
const getId = () => `node_${id++}`;

type AppNode = Node<{ label: string | React.ReactNode }>;

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

  return (
    <div className="w-full h-full bg-amber-100 flex flex-col overflow-hidden">
      <div className="flex-none p-2 border-b border-orange-200 flex items-center justify-between bg-amber-50">
        <button
          className="bg-orange-400 px-4 py-1 rounded text-white font-bold"
          onClick={() => navigate("/select-stage")}
        >
          ←戻る
        </button>
        <div className="text-orange-800 font-bold">Stage {stageId}</div>
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
