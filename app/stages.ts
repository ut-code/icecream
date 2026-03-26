export type ConeColor = "red" | "yellow" | "brown";
export type Flavor = "vanilla" | "chocolate" | "strawberry";
export type Component =
  | { type: "push"; flavor: Flavor }
  | { type: "if"; color: ConeColor }
  | { type: "pop"; flavor: Flavor }
  | { type: "back" };

export const STAGES: Record<
  number,
  {
    mission: Partial<Record<ConeColor, Flavor[]>>;
    components: Component[];
  }
> = {
  1: {
    mission: {
      red: ["vanilla", "chocolate"],
      yellow: ["strawberry", "vanilla"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", color: "red" },
      { type: "if", color: "red" },
      { type: "pop", flavor: "chocolate" },
    ],
  },
};
