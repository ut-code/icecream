import { STAGES, type Component } from "~/stages";
import type { Route } from "./+types/stage.$id";
import { useNavigate } from "react-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type NodeProps,
  type OnConnect,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ConeColor, Flavor, StageData } from "~/stages";
import { icemake, type ComponentGraphNode } from "~/lib/icemake";

let id = 0;
const getId = () => `node_${id++}`;

type AppNode = Node<{
  label: string | React.ReactNode;
  src?: string;
  overlaySrc?: string;
  component: Component;
  componentIndex: number;
}>;

const HANDLE_CLASS = "!w-3 !h-3 !bg-gray-600 !border-2 !border-gray-800";

function getComponentSrc(component: Component): {
  src: string;
  overlaySrc?: string;
} {
  if (component.type === "push") {
    return { src: `/push_${component.flavor}.png` };
  } else if (component.type === "pop") {
    return { src: `/pop_${component.flavor}.png` };
  } else if (component.type === "if") {
    // コーン以外にも対応させる
    const condition = component.condition;
    const coneColor =
      typeof condition === "string" &&
      ["red", "yellow", "brown"].includes(condition)
        ? condition
        : "red"; // default fallback
    return { src: `/if_true.png`, overlaySrc: `/cone_${coneColor}.png` };
  }
  return { src: "" };
}

function StartNode() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="bg-gray-800 text-white font-[DotGothic16] text-xs px-3 py-1 rounded border-2 border-gray-900">
        コーン投入口
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function StraightNode({ data }: NodeProps<AppNode>) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-md border-2 border-transparent h-24 w-24 flex items-center justify-center relative">
        {data.src ? (
          <img src={data.src} alt="" className="h-16" />
        ) : (
          <span className="text-xs font-bold px-2 py-1">{data.label}</span>
        )}
        {data.overlaySrc && (
          <img
            src={data.overlaySrc}
            alt=""
            className="absolute bottom-10 left-2 h-5"
          />
        )}
      </div>
      <div className="relative w-full flex items-center mt-1">
        <Handle
          type="target"
          position={Position.Left}
          className={HANDLE_CLASS}
        />
        <div className="w-full h-0.75 bg-gray-600 rounded" />
        <Handle
          type="source"
          position={Position.Right}
          className={HANDLE_CLASS}
        />
      </div>
    </div>
  );
}

function SplitNode({ data }: NodeProps<AppNode>) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-md border-2 border-transparent h-24 w-24 flex items-center justify-center relative">
        {data.src ? (
          <img src={data.src} alt="" className="h-16" />
        ) : (
          <span className="text-xs font-bold px-2 py-1">{data.label}</span>
        )}
        {data.overlaySrc && (
          <img
            src={data.overlaySrc}
            alt=""
            className="absolute bottom-13 left-5 h-5"
          />
        )}
      </div>
      <svg width="96" height="80" className="mt-1">
        <line x1="0" y1="40" x2="48" y2="40" stroke="#4b5563" strokeWidth="3" />
        <line
          x1="48"
          y1="40"
          x2="96"
          y2="20"
          stroke="#4b5563"
          strokeWidth="3"
        />
        <line
          x1="48"
          y1="40"
          x2="96"
          y2="60"
          stroke="#4b5563"
          strokeWidth="3"
        />
        <text
          x="80"
          y="16"
          className="fill-green-700"
          fontSize="10"
          fontFamily="DotGothic16"
        >
          ○
        </text>
        <text
          x="80"
          y="74"
          className="fill-red-700"
          fontSize="10"
          fontFamily="DotGothic16"
        >
          ×
        </text>
      </svg>
      <Handle
        type="target"
        position={Position.Left}
        className={HANDLE_CLASS}
        style={{ top: "calc(100% - 40px)" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className={HANDLE_CLASS}
        style={{ top: "calc(100% - 60px)" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className={HANDLE_CLASS}
        style={{ top: "calc(100% - 20px)" }}
      />
    </div>
  );
}

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
  stageData: StageData;
}) {
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeTypes = useMemo(
    () => ({ start: StartNode, straight: StraightNode, split: SplitNode }),
    [],
  );
  const [remainedComponentIdxs, setRemainedComponentIdxs] = useState<number[]>([
    ...Array(stageData.components.length).keys(),
  ]);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
    {
      id: "start",
      type: "start",
      position: { x: 0, y: 150 },
      data: {
        label: "始点",
        component: { type: "push", flavor: "vanilla" } as Component,
        componentIndex: -1, // -1 indicates start node
      },
      draggable: false,
      deletable: false,
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const [isClear, setIsClear] = useState(false);
  const [failMessage, setFailMessage] = useState("");

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const sourceNode = nodes.find((n) => n.id === params.source);
        const isSplitNode = sourceNode?.type === "split";

        if (isSplitNode) {
          return addEdge(
            params,
            eds.filter(
              (e) =>
                !(
                  e.source === params.source &&
                  e.sourceHandle === params.sourceHandle
                ),
            ),
          );
        } else {
          return addEdge(
            params,
            eds.filter((e) => e.source !== params.source),
          );
        }
      });
    },
    [setEdges, nodes],
  );

  const onDragStart = (
    e: React.DragEvent,
    componentData: string,
    componentIndex: number,
  ) => {
    e.dataTransfer.setData("application/reactflow", componentData);
    e.dataTransfer.setData("componentIndex", String(componentIndex));
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
      const indexStr = e.dataTransfer.getData("componentIndex");
      if (!dataStr) return;

      const component: Component = JSON.parse(dataStr);
      const componentIndex = Number(indexStr);

      setRemainedComponentIdxs((prev) =>
        prev.filter((i) => i !== componentIndex),
      );

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      // Center the node on the cursor position
      const NODE_WIDTH = 96;
      const NODE_HEIGHT = component.type === "if" ? 176 : 120;

      const centeredPosition = {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      };

      const { src, overlaySrc } = getComponentSrc(component);

      const newNode: AppNode = {
        id: getId(),
        type: component.type === "if" ? "split" : "straight",
        position: centeredPosition,
        data: {
          label: component.type,
          src,
          overlaySrc,
          component,
          componentIndex,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const generateComponents = (
    nodes: AppNode[],
    edges: Edge[],
    stageComponents: Component[],
  ) => {
    const components: Record<number, ComponentGraphNode> = {};

    for (const node of nodes) {
      if (node.id === "start") continue;

      const componentIndex = node.data.componentIndex;
      const component = stageComponents[componentIndex];

      const outgoingEdges = edges.filter((edge) => edge.source === node.id);

      let childrenIds:
        | number
        | null
        | { true: number | null; false: number | null };

      if (component.type === "if") {
        const trueEdge = outgoingEdges.find(
          (e) => e.sourceHandle === "true" || !e.sourceHandle,
        );
        const falseEdge = outgoingEdges.find((e) => e.sourceHandle === "false");

        const trueTarget = trueEdge
          ? nodes.find((n) => n.id === trueEdge.target)
          : null;
        const falseTarget = falseEdge
          ? nodes.find((n) => n.id === falseEdge.target)
          : null;

        childrenIds = {
          true:
            trueTarget && trueTarget.id !== "start"
              ? trueTarget.data.componentIndex
              : null,
          false:
            falseTarget && falseTarget.id !== "start"
              ? falseTarget.data.componentIndex
              : null,
        };
      } else {
        if (outgoingEdges.length > 0) {
          const target = nodes.find((n) => n.id === outgoingEdges[0].target);
          childrenIds =
            target && target.id !== "start" ? target.data.componentIndex : null;
        } else {
          childrenIds = null;
        }
      }

      components[componentIndex] = {
        coord: { x: node.position.x, y: node.position.y },
        childrenIds,
      };
    }

    console.log(components);

    return components;
  };

  const handleExecute = () => {
    const components = generateComponents(nodes, edges, stageData.components);

    const startEdge = edges.find((e) => e.source === "start");
    if (!startEdge) {
      setFailMessage("始点からコンポーネントを接続してください");
      return;
    }

    const firstNode = nodes.find((n) => n.id === startEdge.target);
    if (!firstNode || firstNode.id === "start") {
      setFailMessage("始点からの接続が正しくありません");
      return;
    }

    const firstComponentId = firstNode.data.componentIndex;

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
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultViewport={{ x: 20, y: 200, zoom: 1 }}
        >
          <Controls />
        </ReactFlow>
      </div>

      <div className="bg-amber-50 h-32 flex items-center gap-4 px-4 overflow-x-auto border-t-2 border-orange-200 flex-none">
        {stageData.components.map((component: Component, index: number) => {
          if (!remainedComponentIdxs.includes(index)) return;

          const { src, overlaySrc } = getComponentSrc(component);

          return (
            <div
              key={index}
              draggable
              onDragStart={(e) =>
                onDragStart(e, JSON.stringify(component), index)
              }
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
              {overlaySrc && (
                <img
                  src={overlaySrc}
                  alt=""
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
