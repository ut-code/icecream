export type ConeColor = "red" | "yellow" | "brown";
export type Flavor = "vanilla" | "chocolate" | "strawberry";
export type Component =
  | { type: "start" }
  | { type: "push"; flavor: Flavor }
  | { type: "if"; condition: ConeColor | Flavor | Flavor[] | number }
  | { type: "pop"; flavor: Flavor };
export type StageData = {
  mission: Partial<Record<ConeColor, Flavor[]>>;
  components: Component[];
};

export const STAGES: Record<number, StageData> = {
  1: {
    mission: {
      red: ["vanilla", "chocolate"],
      yellow: ["strawberry", "vanilla"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
      { type: "if", condition: "red" },
      { type: "pop", flavor: "chocolate" },
    ],
  },
  2: {
    mission: {
      brown: ["chocolate", "chocolate", "vanilla"],
    },
    components: [
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "vanilla" },
      { type: "if", condition: "brown" },
      { type: "if", condition: "brown" },
    ],
  },
  3: {
    mission: {
      red: ["chocolate"],
      yellow: ["chocolate"],
    },
    components: [
      { type: "if", condition: "yellow" },
      { type: "if", condition: "strawberry" },
      { type: "if", condition: ["chocolate", "strawberry"] },
      { type: "if", condition: 3 },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "chocolate" },
    ],
  },
};
