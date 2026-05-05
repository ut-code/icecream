import { STAGES } from "~/stages";
import type { ConeColor, Flavor, Component } from "~/stages";

export type ComponentGraphNode = {
  coord: { x: number; y: number };
  childrenIds: number | null | { true: number | null; false: number | null };
};

export type ExecutionStep = {
  componentIndex: number;
  stack: Flavor[] | null; // コーンが食べられたらnull
  branchTaken?: boolean;
};

export type IcemakeResult = {
  result: Partial<Record<ConeColor, Flavor[]>>;
  traces: { color: ConeColor; steps: ExecutionStep[] }[];
};

// 1つのコーンに積めるアイスの最大数（UI上の想定に合わせた安全上限）
const MAX_ICE_STACK_SIZE = 10;

export function icemake(
  colors: ConeColor[],
  stage: number,
  graph?: Record<number, ComponentGraphNode>,
  firstComponentId?: number,
): IcemakeResult {
  const stageData = STAGES[stage];
  if (!stageData) return { result: {}, traces: [] };

  // グラフが渡されたときは、各色ごとに実行トレースを取りながら結果を計算する
  if (graph && firstComponentId !== undefined) {
    const traces = colors.map((color) => {
      const steps = runGraphExecution(
        stageData.components,
        color,
        graph,
        firstComponentId,
      );
      return { color, steps };
    });
    // 最終ステップのstackをその色の完成結果として採用する
    const result = Object.fromEntries(
      traces.map(({ color, steps }) => [
        color,
        steps.length > 0 ? (steps[steps.length - 1].stack ?? []) : [],
      ]),
    );
    return { result, traces };
  }

  return {
    // グラフ未実行時はステージ定義のミッションを既定値として返す
    result: Object.fromEntries(
      colors.map((color) => [color, stageData.mission[color] ?? []]),
    ),
    traces: [],
  };
}

function runGraphExecution(
  components: Component[],
  color: ConeColor,
  graph: Record<number, ComponentGraphNode>,
  firstComponentId: number,
): ExecutionStep[] {
  // コーンが食べられたらnull
  let stack: Flavor[] | null = [];
  const steps: ExecutionStep[] = [];
  // 同じノード + 同じstack状態に再訪したら無限ループとみなして停止する
  const visited: Map<number, Set<string>> = new Map();
  let currentId: number | null = firstComponentId;

  const coneColors: ConeColor[] = ["red", "yellow", "brown"];
  const flavors: Flavor[] = ["vanilla", "chocolate", "strawberry"];

  while (currentId !== null) {
    const component: Component | undefined = components[currentId];
    const node: ComponentGraphNode | undefined = graph[currentId];
    if (!component || !node) break;

    const stackKey = JSON.stringify(stack);
    if (!visited.has(currentId)) visited.set(currentId, new Set());
    const componentVisited = visited.get(currentId);
    if (!componentVisited || componentVisited.has(stackKey)) break;
    componentVisited.add(stackKey);

    if (!stack) break;

    switch (component.type) {
      case "push":
        if (stack.length < MAX_ICE_STACK_SIZE) stack.push(component.flavor);
        break;
      case "pop":
        if (stack.length === 0) stack = null;
        else if (
          !component.flavor ||
          stack[stack.length - 1] === component.flavor
        )
          stack.pop();
        break;
      case "if":
        break;
    }

    if (!stack) {
      steps.push({
        componentIndex: currentId,
        stack: null,
        branchTaken: undefined,
      });
    } else {
      const children: ComponentGraphNode["childrenIds"] = node.childrenIds;

      let branchTaken: boolean | undefined;
      if (children != null && typeof children !== "number") {
        let condition = false;
        // ifノードの条件を、色 / 先頭フレーバー / 部分配列一致 / 個数で評価する
        if (component.type === "if") {
          const cond: ConeColor | Flavor | Flavor[] | number =
            component.condition;
          if (typeof cond === "string") {
            if (coneColors.includes(cond as ConeColor))
              condition = color === cond;
            else if (flavors.includes(cond as Flavor))
              condition = stack.length > 0 && stack[stack.length - 1] === cond;
          } else if (Array.isArray(cond)) {
            for (let i = 0; i <= stack.length - cond.length; i++) {
              if (
                stack.slice(i, i + cond.length).every((f, j) => f === cond[j])
              ) {
                condition = true;
                break;
              }
            }
          } else if (typeof cond === "number") {
            condition = stack.length >= cond;
          }
        }
        branchTaken = condition;
      }

      steps.push({
        componentIndex: currentId,
        stack: stack === null ? null : [...stack],
        branchTaken,
      });

      if (children == null) break;

      if (typeof children === "number") {
        // 直線接続
        currentId = children;
      } else {
        // 分岐接続（true/false）
        currentId = branchTaken ? children.true : children.false;
      }
    }
  }

  return steps;
}
