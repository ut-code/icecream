import { describe, expect, test } from "vitest";
import { icemake } from "./icemake";
import type { ComponentGraphNode } from "./icemake";
import { STAGES } from "~/stages";

describe("icemake", () => {
  test("produces expected ice cream for each cone color in the mission using a component graph", () => {
    const stage = 1;
    const mission = STAGES[stage].mission;

    const firstComponentId = 3;
    const graph: Record<number, ComponentGraphNode> = {
      0: { coord: { x: 1, y: 1 }, childrenIds: 4 },
      1: { coord: { x: 2, y: 1 }, childrenIds: null },
      2: { coord: { x: 1, y: 2 }, childrenIds: 0 },
      3: { coord: { x: 0, y: 0 }, childrenIds: { true: 0, false: 2 } },
      4: { coord: { x: 2, y: 2 }, childrenIds: { true: 1, false: null } },
    };

    for (const color of Object.keys(mission) as Array<keyof typeof mission>) {
      const expected = mission[color] ?? [];
      const actual = icemake([color], stage, graph, firstComponentId).result[color];
      expect(actual).toEqual(expected);
    }
  });
});
