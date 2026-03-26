import { STAGES } from "~/stages";
import type { ConeColor, Flavor, Component } from "~/stages";

export type ComponentGraphNode = {
  coord: { x: number; y: number };
  childrenIds: number | null | { true: number | null; false: number | null };
};

export function icemake(
  colors: ConeColor[],
  stage: number,
  graph?: Record<number, ComponentGraphNode>,
  firstComponentId?: number,
): Partial<Record<ConeColor, Flavor[]>> {
  const stageData = STAGES[stage];
  if (!stageData) return {};

  if (graph && firstComponentId !== undefined) {
    return Object.fromEntries(
      colors.map((color) => [
        color,
        runGraphExecution(stageData.components, color, graph, firstComponentId),
      ]),
    );
  }

  return Object.fromEntries(
    colors.map((color) => [color, stageData.mission[color] ?? []]),
  );
}

function runGraphExecution(
  components: Component[],
  color: ConeColor,
  graph: Record<number, ComponentGraphNode>,
  firstComponentId: number,
): Flavor[] {
  const stack: Flavor[] = [];
  // Map<componentId, Set<stackStringRepresentation>>
  const visited: Map<number, Set<string>> = new Map();
  let currentId: number | null = firstComponentId;

  const coneColors: ConeColor[] = ["red", "yellow", "brown"];
  const flavors: Flavor[] = ["vanilla", "chocolate", "strawberry"];

  while (currentId !== null) {
    const component: Component | undefined = components[currentId];
    const node: ComponentGraphNode | undefined = graph[currentId];
    if (!component || !node) break;

    // Check if we've visited this component with this exact stack state
    const stackKey = JSON.stringify(stack);
    if (!visited.has(currentId)) {
      visited.set(currentId, new Set());
    }
    const componentVisited = visited.get(currentId)!;
    if (componentVisited.has(stackKey)) {
      console.warn(`Infinite loop detected at component ${currentId} with stack state ${stackKey}`);
      // Infinite loop detected: same component with same stack state
      break;
    }
    componentVisited.add(stackKey);

    switch (component.type) {
      case "push":
        if (stack.length < 5) {
          stack.push(component.flavor);
        }
        break;
      case "pop":
        if (stack.length > 0 && stack[stack.length - 1] === component.flavor) {
          stack.pop();
        }
        break;
      case "if":
        break;
    }

    const children: ComponentGraphNode["childrenIds"] = node.childrenIds;
    if (children == null) break;

    if (typeof children === "number") {
      currentId = children;
    } else {
      let condition: boolean = false;
      if (component.type === "if") {
        const cond : ConeColor | Flavor | Flavor[] | number = component.condition ;
        if (typeof cond === "string") {
          if (coneColors.includes(cond as ConeColor)) {
            condition = color === cond;
          } else if (flavors.includes(cond as Flavor)) {
            condition = stack.length > 0 && stack[stack.length - 1] === cond;
          }
        } else if (Array.isArray(cond)) {
          for (let i = 0; i < stack.length-cond.length+1; i++) {
            if (stack.slice(i, i + cond.length).every((f, j) => f === cond[j])) {
              condition = true;
              break;
            }
          }
        } else if (typeof cond === "number") {
          condition = stack.length >= cond;
        }
      }
      currentId = condition ? children.true : children.false;
    }
  }

  console.log(`Finished execution for color ${color} with final stack:`, stack);
  return stack;
}
