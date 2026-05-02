import { STAGES } from "~/stages";
import type { ConeColor, Flavor, Component } from "~/stages";

export type ComponentGraphNode = {
  coord: { x: number; y: number };
  childrenIds: number | null | { true: number | null; false: number | null };
};

export type ExecutionStep = {
  componentIndex: number;
  stack: Flavor[];
  branchTaken?: boolean;
};

export type IcemakeResult = {
  result: Partial<Record<ConeColor, Flavor[]>>;
  traces: { color: ConeColor; steps: ExecutionStep[] }[];
};

const MAX_ICE_STACK_SIZE = 10;

export function icemake(
  colors: ConeColor[],
  stage: number,
  graph?: Record<number, ComponentGraphNode>,
  firstComponentId?: number,
): IcemakeResult {
  const stageData = STAGES[stage];
  if (!stageData) return { result: {}, traces: [] };

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
    const result = Object.fromEntries(
      traces.map(({ color, steps }) => [
        color,
        steps.length > 0 ? steps[steps.length - 1].stack : [],
      ]),
    );
    return { result, traces };
  }

  return {
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
  const stack: Flavor[] = [];
  const steps: ExecutionStep[] = [];
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

    switch (component.type) {
      case "push":
        if (stack.length < MAX_ICE_STACK_SIZE) stack.push(component.flavor);
        break;
      case "pop":
        if (
          stack.length > 0 &&
          (!component.flavor || stack[stack.length - 1] === component.flavor)
        )
          stack.pop();
        break;
      case "if":
        break;
    }

    const children: ComponentGraphNode["childrenIds"] = node.childrenIds;

    let branchTaken: boolean | undefined;
    if (children != null && typeof children !== "number") {
      let condition = false;
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

    steps.push({ componentIndex: currentId, stack: [...stack], branchTaken });

    if (children == null) break;

    if (typeof children === "number") {
      currentId = children;
    } else {
      currentId = branchTaken ? children.true : children.false;
    }
  }

  return steps;
}
