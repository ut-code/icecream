import { STAGES, type Component } from "~/stages";
import type { Route } from "./+types/stage.$id";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type NodeProps,
  type OnConnect,
  type Edge,
  ConnectionLineType,
  BaseEdge,
  getStraightPath,
  type EdgeProps,
  type OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ConeColor, Flavor, StageData } from "~/stages";
import {
  icemake,
  type ComponentGraphNode,
  type ExecutionStep,
} from "~/lib/icemake";

let id = 0;
const getId = () => `node_${id++}`;

type AppNode = Node<{
  label: string | React.ReactNode;
  src?: string;
  overlaySrc?: string;
  overlaySrcs?: string[];
  overlayNumber?: number;
  component: Component;
  componentIndex: number;
  onDelete?: () => void;
}>;

const HANDLE_CLASS = "!w-3 !h-3 !bg-gray-500 !border-2 !border-gray-800";

function getComponentSrc(
  component: Component,
  branchTaken?: boolean,
): {
  src: string;
  overlaySrc?: string;
  overlaySrcs?: string[];
  overlayNumber?: number;
} {
  if (component.type === "push") {
    return { src: `/push_${component.flavor}.png` };
  } else if (component.type === "pop") {
    return { src: `/pop_${component.flavor}.png` };
  } else if (component.type === "if") {
    const condition = component.condition;

    // Determine base image based on branchTaken
    const baseSrc =
      branchTaken === true
        ? `/if_true.png`
        : branchTaken === false
          ? `/if_false.png`
          : `/if_true.png`;

    // ConeColor
    if (
      typeof condition === "string" &&
      ["red", "yellow", "brown"].includes(condition)
    ) {
      return { src: baseSrc, overlaySrc: `/cone_${condition}.png` };
    }
    // Flavor
    if (
      typeof condition === "string" &&
      ["vanilla", "chocolate", "strawberry"].includes(condition)
    ) {
      return { src: baseSrc, overlaySrc: `/ice_${condition}.png` };
    }
    // Flavor[]
    if (Array.isArray(condition)) {
      const overlayImages = condition.map((flavor) => `/ice_${flavor}.png`);
      return { src: baseSrc, overlaySrcs: overlayImages };
    }
    // number
    if (typeof condition === "number") {
      return { src: baseSrc, overlayNumber: condition };
    }
  }
  return { src: "" };
}

function ConeStack({ color, stack }: { color: ConeColor; stack: Flavor[] }) {
  return (
    <div className="flex flex-col-reverse items-center">
      <img src={`/cone_${color}.png`} alt="" className="h-10" />
      {stack.map((flavor, i) => (
        <img
          key={i}
          src={`/ice_${flavor}.png`}
          alt=""
          className="h-8 -mb-3"
          style={{ zIndex: i + 1 }}
        />
      ))}
    </div>
  );
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
    <div className="group flex flex-col items-center relative">
      <button
        type="button"
        className={`pixel-btn pixel-btn-small absolute -top-0 -right-10 z-10 ${
          data.onDelete
            ? "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", lineHeight: 1 }}
        onClick={() => data.onDelete?.()}
        aria-label="ノードを削除"
      >
        ×
      </button>
      <div className="bg-amber-100 rounded-sm border border-amber-500 h-24 w-24 flex items-center justify-center relative">
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
        <div className="w-full h-3 bg-gray-700 rounded border-2 border-gray-800" />
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
    <div className="group flex flex-col items-center relative">
      <button
        type="button"
        className={`pixel-btn pixel-btn-small absolute -top-0 -right-15 z-10 ${
          data.onDelete
            ? "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", lineHeight: 1 }}
        onClick={() => data.onDelete?.()}
        aria-label="ノードを削除"
      >
        ×
      </button>
      <div className="bg-amber-100 rounded-sm border border-amber-500 h-36 w-36 flex items-center justify-center relative">
        {data.src ? (
          <img src={data.src} alt="" className="h-30" />
        ) : (
          <span className="text-xs font-bold px-2 py-1">{data.label}</span>
        )}
        {data.overlaySrc && (
          <img
            src={data.overlaySrc}
            alt=""
            className="absolute bottom-24 left-15 h-6"
          />
        )}
        {data.overlaySrcs && (
          <div className="absolute bottom-23 left-15 flex flex-col-reverse">
            {data.overlaySrcs.map((src, i) => (
              <img key={i} src={src} alt="" className="h-5 -mb-0.5" />
            ))}
          </div>
        )}
        {data.overlayNumber !== undefined && (
          <div className="absolute bottom-23 left-9 font-bold text-base">
            <span className="text-2xl">{data.overlayNumber}</span>コ
            <ruby>
              以上
              <rt>いじょう</rt>
            </ruby>
          </div>
        )}
      </div>
      <svg width="144" height="80" className="mt-1">
        <line
          x1="0"
          y1="40"
          x2="72"
          y2="40"
          stroke="#1f2937"
          strokeWidth="12"
        />
        <line
          x1="72"
          y1="40"
          x2="144"
          y2="20"
          stroke="#1f2937"
          strokeWidth="12"
        />
        <line
          x1="72"
          y1="40"
          x2="144"
          y2="60"
          stroke="#1f2937"
          strokeWidth="12"
        />
        <text
          x="128"
          y="16"
          className="fill-green-700"
          fontSize="10"
          fontFamily="DotGothic16"
        >
          ○
        </text>
        <text
          x="128"
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

function isFlavorStackMatch(expected: Flavor[], actual?: Flavor[]): boolean {
  if (!actual) return false;
  if (expected.length !== actual.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) return false;
  }
  return true;
}

function checkClear(
  mission: Partial<Record<ConeColor, Flavor[]>>,
  result: Partial<Record<ConeColor, Flavor[]>>,
): boolean {
  for (const [color, expected] of Object.entries(mission) as [
    ConeColor,
    Flavor[],
  ][]) {
    if (!isFlavorStackMatch(expected, result[color])) return false;
  }
  return true;
}

type AnimSegment = {
  stackAfter: Flavor[];
  durationMs: number;
  componentIndex?: number;
  branchTaken?: boolean;
  isNodePause?: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type FlyingCone = {
  id: number;
  color: ConeColor;
  segments: AnimSegment[];
  currentSegment: number;
  segmentStartTime: number;
};

type FlyingConeRender = {
  id: number;
  color: ConeColor;
  x: number;
  y: number;
  stack: Flavor[];
};

type TransitCone = {
  id: number;
  color: ConeColor;
  stack: Flavor[];
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  startTime: number;
  durationMs: number;
};

type PaletteEntry = {
  color: ConeColor;
  stack: Flavor[];
};

type DragOverlayNode = {
  id: string;
  type: AppNode["type"];
  data: AppNode["data"];
  x: number;
  y: number;
};

type AnimState = {
  cones: FlyingCone[];
  spawnQueue: { color: ConeColor; segments: AnimSegment[] }[];
  nextSpawnTime: number;
  nextId: number;
  result: Partial<Record<ConeColor, Flavor[]>>;
  transitCones: TransitCone[];
};

const SPEED_PPS = 100;
const SPAWN_INTERVAL_MS = 2000;
const NODE_WIDTH_PX = 96;
const SPLIT_NODE_WIDTH_PX = 144;
const SPLIT_Y_OFFSET = 20;
const PAUSE_AT_NODE_MS = 200;
const PAUSE_AT_TERMINAL_MS = 600;
const MIN_SEGMENT_MS = 80;
const TRANSIT_DURATION_MS = 700;

function getEdgePathEl(edgeId: string): SVGPathElement | null {
  return (
    (document.querySelector(
      `[data-testid="rf__edge-${edgeId}"] .react-flow__edge-path`,
    ) as SVGPathElement | null) ??
    (document.querySelector(
      `.react-flow__edge[data-id="${edgeId}"] .react-flow__edge-path`,
    ) as SVGPathElement | null)
  );
}

function lengthMs(dist: number): number {
  return Math.max((dist / SPEED_PPS) * 1000, MIN_SEGMENT_MS);
}

function distMs(x1: number, y1: number, x2: number, y2: number): number {
  return lengthMs(Math.hypot(x2 - x1, y2 - y1));
}

function findEdgeByBranch(
  allEdges: Edge[],
  sourceId: string,
  targetId: string | undefined,
  branch: boolean | undefined,
): Edge | undefined {
  return allEdges.find((e) => {
    if (e.source !== sourceId) return false;
    if (targetId !== undefined && e.target !== targetId) return false;
    if (branch === undefined) return true;
    return e.sourceHandle === (branch ? "true" : "false");
  });
}

function buildFullPath(
  trace: ExecutionStep[],
  allNodes: AppNode[],
  allEdges: Edge[],
): AnimSegment[] {
  if (trace.length === 0) return [];

  const nodeByComp = new Map<number, AppNode>();
  for (const n of allNodes) {
    if (n.id !== "start") nodeByComp.set(n.data.componentIndex, n);
  }

  // Collect resolved edge paths for each step
  type ResolvedEdge = { pathEl: SVGPathElement; totalLength: number };
  const edgePaths: ResolvedEdge[] = [];

  const firstNode = nodeByComp.get(trace[0].componentIndex);
  if (!firstNode) return [];
  const startEdge = allEdges.find(
    (e) => e.source === "start" && e.target === firstNode.id,
  );
  if (!startEdge) return [];
  const startPathEl = getEdgePathEl(startEdge.id);
  if (!startPathEl) return [];
  edgePaths.push({
    pathEl: startPathEl,
    totalLength: startPathEl.getTotalLength(),
  });

  for (let i = 1; i < trace.length; i++) {
    const fromNode = nodeByComp.get(trace[i - 1].componentIndex);
    const toNode = nodeByComp.get(trace[i].componentIndex);
    if (!fromNode || !toNode) break;

    const edge = findEdgeByBranch(
      allEdges,
      fromNode.id,
      toNode.id,
      trace[i - 1].branchTaken,
    );
    if (!edge) break;
    const pathEl = getEdgePathEl(edge.id);
    if (!pathEl) break;
    edgePaths.push({ pathEl, totalLength: pathEl.getTotalLength() });
  }

  const segments: AnimSegment[] = [];

  for (let i = 0; i < edgePaths.length; i++) {
    const { pathEl, totalLength } = edgePaths[i];
    const prevStack = i > 0 ? trace[i - 1].stack : [];
    const curStack = trace[i].stack;
    const componentIndex = trace[i].componentIndex;
    const branchTaken = trace[i].branchTaken;

    // 1. Edge segment (precompute start/end for stable coordinates)
    const edgeStart = pathEl.getPointAtLength(0);
    const edgeEnd = pathEl.getPointAtLength(totalLength);
    segments.push({
      x1: edgeStart.x,
      y1: edgeStart.y,
      x2: edgeEnd.x,
      y2: edgeEnd.y,
      stackAfter: prevStack,
      durationMs: lengthMs(totalLength),
      componentIndex,
      branchTaken,
    });

    const inp = edgeEnd;

    // Determine output handle position
    let outX: number;
    let outY: number;

    if (i < edgePaths.length - 1) {
      const p = edgePaths[i + 1].pathEl.getPointAtLength(0);
      outX = p.x;
      outY = p.y;
    } else {
      const lastNode = nodeByComp.get(trace[i].componentIndex);
      const nodeWidth = lastNode?.type === "split" ? SPLIT_NODE_WIDTH_PX : NODE_WIDTH_PX;
      outX = inp.x + nodeWidth;
      outY = inp.y;
      if (lastNode?.type === "split" && trace[i].branchTaken !== undefined) {
        outY = trace[i].branchTaken
          ? inp.y - SPLIT_Y_OFFSET
          : inp.y + SPLIT_Y_OFFSET;
      }
      if (lastNode) {
        const outEdge = findEdgeByBranch(
          allEdges,
          lastNode.id,
          undefined,
          trace[i].branchTaken,
        );
        if (outEdge) {
          const outPath = getEdgePathEl(outEdge.id);
          if (outPath) {
            const p = outPath.getPointAtLength(0);
            outX = p.x;
            outY = p.y;
          }
        }
      }
    }

    // Center = midpoint X, input Y (split point for if-nodes)
    const cx = (inp.x + outX) / 2;
    const cy = inp.y;

    // 2. Input handle → center (old stack still)
    segments.push({
      x1: inp.x,
      y1: inp.y,
      x2: cx,
      y2: cy,
      stackAfter: prevStack,
      durationMs: distMs(inp.x, inp.y, cx, cy),
      componentIndex,
      branchTaken,
    });

    // 3. Pause at center (stack updates here)
    segments.push({
      x1: cx,
      y1: cy,
      x2: cx,
      y2: cy,
      stackAfter: curStack,
      durationMs: PAUSE_AT_NODE_MS,
      componentIndex,
      branchTaken,
      isNodePause: true,
    });

    // 4. Center → output handle (new stack, diagonal for split nodes)
    segments.push({
      x1: cx,
      y1: cy,
      x2: outX,
      y2: outY,
      stackAfter: curStack,
      durationMs: distMs(cx, cy, outX, outY),
      componentIndex,
      branchTaken,
    });

    // 5. Terminal pause (last node only)
    if (i === edgePaths.length - 1) {
      segments.push({
        x1: outX,
        y1: outY,
        x2: outX,
        y2: outY,
        stackAfter: curStack,
        durationMs: PAUSE_AT_TERMINAL_MS,
        componentIndex,
        branchTaken,
      });
    }
  }

  return segments;
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
        componentIndex: -1,
      },
      draggable: false,
      deletable: false,
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition, getViewport } = useReactFlow();
  const [isClear, setIsClear] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingCones, setFlyingCones] = useState<FlyingConeRender[]>([]);
  const [takenBranchMap, setTakenBranchMap] = useState<
    Map<number, boolean | undefined>
  >(new Map());
  const animRef = useRef<AnimState | null>(null);
  const rafRef = useRef<number | null>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const paletteTrayRef = useRef<HTMLDivElement>(null);
  const paletteSlotRefs = useRef<Map<ConeColor, HTMLDivElement>>(new Map());
  const [transitConeRenders, setTransitConeRenders] = useState<
    FlyingConeRender[]
  >([]);
  const [paletteEntries, setPaletteEntries] = useState<PaletteEntry[]>([]);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [dragOverlayNode, setDragOverlayNode] = useState<DragOverlayNode | null>(null);
  const nodeTypes = useMemo(
    () => ({ start: StartNode, straight: StraightNode, split: SplitNode }),
    [],
  );

  function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style }: EdgeProps) {
    const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    const buttonWidth = 60;
    const buttonHeight = 24;
    const isDeleteVisible = hoveredEdgeId === id;

    return (
      <>
        <BaseEdge path={edgePath} style={style} />
        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={24}
          onMouseEnter={() => setHoveredEdgeId(id)}
          onMouseMove={() => setHoveredEdgeId(id)}
          onMouseLeave={() => {
            setHoveredEdgeId((prev) => (prev === id ? null : prev));
          }}
          style={{ pointerEvents: "stroke" }}
        />
        <foreignObject
          x={midX - buttonWidth / 2}
          y={midY - buttonHeight - 8}
          width={buttonWidth}
          height={buttonHeight}
          onMouseEnter={() => setHoveredEdgeId(id)}
          onMouseLeave={() => {
            setHoveredEdgeId((prev) => (prev === id ? null : prev));
          }}
          style={{
            overflow: "visible",
            opacity: isDeleteVisible ? 1 : 0,
            pointerEvents: isDeleteVisible ? "auto" : "none",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              className="pixel-btn pixel-btn-small"
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", lineHeight: 1 }}
              onClick={() => setEdges((edges) => edges.filter((e) => e.id !== id))}
              aria-label="エッジを削除"
            >
              ×
            </button>
          </div>
        </foreignObject>
      </>
    );
  }

  const edgeTypes = useMemo(
    () => ({ custom: CustomEdge }),
    [hoveredEdgeId],
  );

  const renderedNodes = useMemo(
    () =>
      nodes.map((node) => {
        if (node.id !== dragOverlayNode?.id) return node;
        return {
          ...node,
          style: {
            ...node.style,
            opacity: 0,
          },
        };
      }),
    [nodes, dragOverlayNode?.id],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      const style = { stroke: "#6b7280", strokeWidth: 10, strokeLinecap: "round" as const };

      setEdges((eds) => {
        const sourceNode = nodes.find((n) => n.id === params.source);
        const isSplitNode = sourceNode?.type === "split";

        if (isSplitNode) {
          return addEdge(
            { ...params, style },
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
            { ...params, style },
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

  const onNodeDragStart: OnNodeDrag<AppNode> = useCallback(
    (_event, node) => {
      if (node.id === "start") return;
      if (!outerContainerRef.current || !reactFlowWrapper.current) return;

      const outerRect = outerContainerRef.current.getBoundingClientRect();
      const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
      const viewport = getViewport();

      setDragOverlayNode({
        id: node.id,
        type: node.type,
        data: node.data,
        x:
          wrapperRect.left -
          outerRect.left +
          node.position.x * viewport.zoom +
          viewport.x,
        y:
          wrapperRect.top -
          outerRect.top +
          node.position.y * viewport.zoom +
          viewport.y,
      });
    },
    [getViewport],
  );

  const onNodeDrag: OnNodeDrag<AppNode> = useCallback(
    (_event, node) => {
      if (node.id === "start") return;
      if (!outerContainerRef.current || !reactFlowWrapper.current) return;

      const outerRect = outerContainerRef.current.getBoundingClientRect();
      const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
      const viewport = getViewport();

      setDragOverlayNode({
        id: node.id,
        type: node.type,
        data: node.data,
        x:
          wrapperRect.left -
          outerRect.left +
          node.position.x * viewport.zoom +
          viewport.x,
        y:
          wrapperRect.top -
          outerRect.top +
          node.position.y * viewport.zoom +
          viewport.y,
      });
    },
    [getViewport],
  );

  const removePlacedNode = useCallback(
    (nodeId: string, componentIndex: number) => {
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setEdges((prev) =>
        prev.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      setRemainedComponentIdxs((prev) => {
        if (prev.includes(componentIndex)) return prev;
        return [...prev, componentIndex].sort((a, b) => a - b);
      });
    },
    [setNodes, setEdges, setRemainedComponentIdxs],
  );

  const onNodeDragStop: OnNodeDrag<AppNode> = useCallback(
    (_event, node) => {
      setDragOverlayNode(null);
      if (node.id === "start") return;
      if (!paletteTrayRef.current || !reactFlowWrapper.current) return;

      const trayTop = paletteTrayRef.current.getBoundingClientRect().top;
      const wrapperTop = reactFlowWrapper.current.getBoundingClientRect().top;
      const viewport = getViewport();
      const nodeHeight = node.type === "split" ? 176 : 120;

      const nodeTop = wrapperTop + node.position.y * viewport.zoom + viewport.y;
      const nodeBottom = nodeTop + nodeHeight * viewport.zoom;

      if (nodeBottom >= trayTop) {
        removePlacedNode(node.id, node.data.componentIndex);
      }
    },
    [getViewport, removePlacedNode],
  );

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

      const { src, overlaySrc, overlaySrcs, overlayNumber } =
        getComponentSrc(component);

      const id = getId();
      const newNode: AppNode = {
        id,
        type: component.type === "if" ? "split" : "straight",
        position: centeredPosition,
        data: {
          label: component.type,
          src,
          overlaySrc,
          overlaySrcs,
          overlayNumber,
          component,
          componentIndex,
          onDelete: () => {
            removePlacedNode(id, componentIndex);
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [removePlacedNode, screenToFlowPosition, setNodes],
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

    return components;
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Update node images based on activeComponents
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (
          node.data.componentIndex === undefined ||
          node.data.componentIndex < 0
        ) {
          return node;
        }

        const branchTaken = takenBranchMap.get(node.data.componentIndex);
        if (branchTaken === undefined && takenBranchMap.size > 0) {
          return node;
        }

        const component = node.data.component;
        if (component.type === "if") {
          const { src, overlaySrc, overlaySrcs, overlayNumber } =
            getComponentSrc(component, branchTaken);
          return {
            ...node,
            data: {
              ...node.data,
              src,
              overlaySrc,
              overlaySrcs,
              overlayNumber,
            },
          };
        }

        return node;
      }),
    );
  }, [takenBranchMap, setNodes]);

  const handleExecute = () => {
    if (isAnimating) return;

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
    const { result, traces } = icemake(
      colors,
      stageId,
      components,
      firstComponentId,
    );

    const spawnQueue = traces.map(({ color, steps }) => ({
      color,
      segments: buildFullPath(steps, nodes, edges),
    }));

    setFailMessage("");
    setIsClear(false);
    setIsAnimating(true);
    setPaletteEntries([]);
    setTransitConeRenders([]);

    animRef.current = {
      cones: [],
      spawnQueue,
      nextSpawnTime: 0,
      nextId: 0,
      result,
      transitCones: [],
    };

    const loop = (timestamp: number) => {
      const anim = animRef.current;
      if (!anim) {
        setIsAnimating(false);
        setFlyingCones([]);
        return;
      }

      // Spawn cones at intervals
      if (
        anim.spawnQueue.length > 0 &&
        (anim.cones.length === 0 || timestamp >= anim.nextSpawnTime)
      ) {
        const next = anim.spawnQueue.shift()!;
        anim.cones.push({
          id: anim.nextId++,
          color: next.color,
          segments: next.segments,
          currentSegment: 0,
          segmentStartTime: timestamp,
        });
        anim.nextSpawnTime = timestamp + SPAWN_INTERVAL_MS;
      }

      // Compute positions
      const viewport = getViewport();
      const rendered: FlyingConeRender[] = [];

      for (const cone of anim.cones) {
        if (cone.currentSegment >= cone.segments.length) continue;

        const seg = cone.segments[cone.currentSegment];
        const elapsed = timestamp - cone.segmentStartTime;
        const progress = Math.min(elapsed / seg.durationMs, 1);

        // Update image only when state changes during node pause
        if (seg.isNodePause && seg.componentIndex !== undefined) {
          const currentState = takenBranchMap.get(seg.componentIndex);
          if (currentState !== seg.branchTaken) {
            setTakenBranchMap((prev) => {
              const next = new Map(prev);
              next.set(seg.componentIndex!, seg.branchTaken);
              return next;
            });
          }
        }

        const px = seg.x1 + (seg.x2 - seg.x1) * progress;
        const py = seg.y1 + (seg.y2 - seg.y1) * progress;

        const stack =
          progress >= 1
            ? seg.stackAfter
            : cone.currentSegment > 0
              ? cone.segments[cone.currentSegment - 1].stackAfter
              : [];

        rendered.push({
          id: cone.id,
          color: cone.color,
          x: px * viewport.zoom + viewport.x,
          y: py * viewport.zoom + viewport.y,
          stack,
        });

        if (progress >= 1) {
          cone.currentSegment++;
          cone.segmentStartTime = timestamp;
        }
      }

      // Detect cones that just finished all segments → create transit cones
      const justFinished = anim.cones.filter(
        (c) => c.currentSegment >= c.segments.length,
      );

      if (
        justFinished.length > 0 &&
        outerContainerRef.current &&
        reactFlowWrapper.current
      ) {
        const outerRect =
          outerContainerRef.current.getBoundingClientRect();
        const wrapperRect =
          reactFlowWrapper.current.getBoundingClientRect();

        for (const cone of justFinished) {
          const renderedCone = rendered.find((r) => r.id === cone.id);
          if (!renderedCone) continue;

          const startX =
            renderedCone.x + wrapperRect.left - outerRect.left;
          const startY =
            renderedCone.y + wrapperRect.top - outerRect.top;

          const slotEl = paletteSlotRefs.current.get(cone.color);
          if (!slotEl) continue;
          const slotRect = slotEl.getBoundingClientRect();
          const targetX =
            slotRect.left - outerRect.left + slotRect.width / 2;
          const targetY =
            slotRect.top - outerRect.top + slotRect.height / 2;

          const lastSeg = cone.segments[cone.segments.length - 1];

          anim.transitCones.push({
            id: cone.id,
            color: cone.color,
            stack: lastSeg.stackAfter,
            startX,
            startY,
            targetX,
            targetY,
            startTime: timestamp,
            durationMs: TRANSIT_DURATION_MS,
          });
        }
      }

      // Remove finished cones
      anim.cones = anim.cones.filter(
        (c) => c.currentSegment < c.segments.length,
      );

      // Update transit cones
      const transitRendered: FlyingConeRender[] = [];
      const arrivedTransit: TransitCone[] = [];

      for (const tc of anim.transitCones) {
        const elapsed = timestamp - tc.startTime;
        const progress = Math.min(elapsed / tc.durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const x = tc.startX + (tc.targetX - tc.startX) * eased;
        const y = tc.startY + (tc.targetY - tc.startY) * eased;

        if (progress >= 1) {
          arrivedTransit.push(tc);
        } else {
          transitRendered.push({
            id: tc.id,
            color: tc.color,
            x,
            y,
            stack: tc.stack,
          });
        }
      }

      if (arrivedTransit.length > 0) {
        anim.transitCones = anim.transitCones.filter(
          (tc) => !arrivedTransit.includes(tc),
        );
        setPaletteEntries((prev) => [
          ...prev,
          ...arrivedTransit.map((tc) => ({
            color: tc.color,
            stack: tc.stack,
          })),
        ]);
      }

      setTransitConeRenders(transitRendered);
      setFlyingCones(rendered);

      // All done?
      if (
        anim.cones.length === 0 &&
        anim.spawnQueue.length === 0 &&
        anim.transitCones.length === 0
      ) {
        animRef.current = null;
        setIsAnimating(false);
        setFlyingCones([]);
        setTransitConeRenders([]);
        setTakenBranchMap(new Map());
        if (checkClear(stageData.mission, anim.result)) {
          setIsClear(true);
        } else {
          setFailMessage("不一致です。もう一度試してください。");
        }
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const nextStageExists = STAGES[stageId + 1] !== undefined;

  const handleNavigate = (path: string) => {
    setIsClear(false);
    setFailMessage("");
    navigate(path);
  };

  const missionColors = Object.keys(stageData.mission) as ConeColor[];
  const allArrivedToPalette =
    !isAnimating &&
    paletteEntries.length > 0 &&
    missionColors.every((c) => paletteEntries.some((e) => e.color === c));

  return (
    <div
      className="w-full h-full bg-amber-100 flex flex-col overflow-hidden relative"
      ref={outerContainerRef}
    >
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

      <div className="grow relative overflow-visible z-0" ref={reactFlowWrapper}>
        <ReactFlow
          className="stage-flow"
          nodes={renderedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeMouseEnter={(_event, edge) => setHoveredEdgeId(edge.id)}
          onEdgeMouseLeave={(_event, edge) =>
            setHoveredEdgeId((prev) => (prev === edge.id ? null : prev))
          }
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDrag={onNodeDrag}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          nodeDragThreshold={5}
          autoPanOnNodeDrag={false}
          deleteKeyCode={null}
          defaultEdgeOptions={{
            type: "custom",
            selectable: true,
            style: {
              strokeWidth: 10,
              strokeLinecap: "round",
            },
          }}
          connectionLineType={ConnectionLineType.Straight}
          defaultViewport={{ x: 20, y: 100, zoom: 1 }}
        >
        </ReactFlow>

        {flyingCones.map((cone) => (
          <div
            key={cone.id}
            className="absolute pointer-events-none"
            style={{
              left: cone.x,
              top: cone.y,
              transform: "translate(-50%, -50%)",
              zIndex: 100,
            }}
          >
            <ConeStack color={cone.color} stack={cone.stack} />
          </div>
        ))}

        {/* Result palette (floating inside canvas) */}
        <div className="absolute top-3 right-3 w-40 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-gray-300 shadow-lg flex flex-col p-3 gap-3 z-10 max-h-[calc(100%-24px)] overflow-y-auto">
          <div className="font-[DotGothic16] text-sm text-center text-gray-600">
            けっか
          </div>
          {missionColors.map((color) => {
            const entry = paletteEntries.find((e) => e.color === color);
            const expected = stageData.mission[color]!;
            const isMatch = isFlavorStackMatch(expected, entry?.stack);

            return (
              <div
                key={color}
                ref={(el) => {
                  if (el) paletteSlotRefs.current.set(color, el);
                }}
                className={`border-2 rounded-lg p-2 flex flex-col items-center min-h-32 justify-center ${
                  allArrivedToPalette
                    ? isMatch
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : entry
                      ? "border-gray-300"
                      : "border-dashed border-gray-300"
                }`}
              >
                {entry ? (
                  <ConeStack color={entry.color} stack={entry.stack} />
                ) : (
                  <img
                    src={`/cone_${color}.png`}
                    alt=""
                    className="h-8 opacity-30"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {dragOverlayNode && (
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: dragOverlayNode.x,
            top: dragOverlayNode.y,
            transform: "translate(0, 0)",
          }}
        >
          {dragOverlayNode.type === "split" ? (
            <div className="bg-amber-100 rounded-sm border border-amber-500 h-36 w-36 flex items-center justify-center relative">
              {dragOverlayNode.data.src ? (
                <img src={dragOverlayNode.data.src} alt="" className="h-30" />
              ) : (
                <span className="text-xs font-bold px-2 py-1">
                  {dragOverlayNode.data.label}
                </span>
              )}
              {dragOverlayNode.data.overlaySrc && (
                <img
                  src={dragOverlayNode.data.overlaySrc}
                  alt=""
                  className="absolute bottom-24 left-15 h-6"
                />
              )}
              {dragOverlayNode.data.overlaySrcs && (
                <div className="absolute bottom-23 left-15 flex flex-col-reverse">
                  {dragOverlayNode.data.overlaySrcs.map((src, i) => (
                    <img key={i} src={src} alt="" className="h-5 -mb-0.5" />
                  ))}
                </div>
              )}
              {dragOverlayNode.data.overlayNumber !== undefined && (
                <div className="absolute bottom-23 left-9 font-bold text-base">
                  <span className="text-2xl">{dragOverlayNode.data.overlayNumber}</span>コ
                  <ruby>
                    以上
                    <rt>いじょう</rt>
                  </ruby>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-100 rounded-sm border border-amber-500 h-24 w-24 flex items-center justify-center relative">
              {dragOverlayNode.data.src ? (
                <img src={dragOverlayNode.data.src} alt="" className="h-16" />
              ) : (
                <span className="text-xs font-bold px-2 py-1">
                  {dragOverlayNode.data.label}
                </span>
              )}
              {dragOverlayNode.data.overlaySrc && (
                <img
                  src={dragOverlayNode.data.overlaySrc}
                  alt=""
                  className="absolute bottom-10 left-2 h-5"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Transit cones (flying to palette) */}
      {transitConeRenders.map((cone) => (
        <div
          key={cone.id}
          className="absolute pointer-events-none"
          style={{
            left: cone.x,
            top: cone.y,
            transform: "translate(-50%, -50%)",
            zIndex: 200,
          }}
        >
          <ConeStack color={cone.color} stack={cone.stack} />
        </div>
      ))}

      <div
        className="bg-amber-50 h-50 flex items-center gap-4 px-4 overflow-x-auto border-t-2 border-orange-200 flex-none relative z-10"
        ref={paletteTrayRef}
      >
        {stageData.components.map((component: Component, index: number) => {
          if (!remainedComponentIdxs.includes(index)) return;

          const { src, overlaySrc, overlaySrcs, overlayNumber } =
            getComponentSrc(component);

          const hasOverlay =
            overlaySrc || overlaySrcs || overlayNumber !== undefined;

          return (
            <div
              key={index}
              draggable
              onDragStart={(e) =>
                onDragStart(e, JSON.stringify(component), index)
              }
              className={`${hasOverlay ? "h-36 w-36" : "h-24 w-24"} shrink-0 bg-white rounded-lg shadow-md flex items-center justify-center relative cursor-grab active:cursor-grabbing hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-orange-300`}
            >
              {src ? (
                <img
                  src={src}
                  alt={component.type}
                  className={`${hasOverlay ? "h-30" : "h-20"} pointer-events-none`}
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
                  className="absolute bottom-24 left-15 h-6 pointer-events-none"
                />
              )}
              {overlaySrcs && (
                <div className="absolute bottom-23 left-15 flex flex-col-reverse pointer-events-none">
                  {overlaySrcs.map((imgSrc, i) => (
                    <img key={i} src={imgSrc} alt="" className="h-5 -mb-0.5" />
                  ))}
                </div>
              )}
              {overlayNumber !== undefined && (
                <div className="absolute bottom-23 left-9 font-bold text-base pointer-events-none">
                  <span className="text-2xl">{overlayNumber}</span>コ
                  <ruby>
                    以上
                    <rt>いじょう</rt>
                  </ruby>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Execute button */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          type="button"
          className="pixel-btn"
          onClick={handleExecute}
          disabled={isAnimating}
        >
          {isAnimating ? "実行中..." : "実行"}
        </button>
      </div>

      {/* Fail message */}
      {failMessage && (
        <div className="absolute bottom-20 right-6 z-40 bg-red-200 border-2 border-red-500 px-4 py-2 rounded font-[DotGothic16]">
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
