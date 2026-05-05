export type ConeColor = "red" | "yellow" | "brown";
export type Flavor = "vanilla" | "chocolate" | "strawberry";
export type Component =
  | { type: "start" }
  | { type: "push"; flavor: Flavor }
  | { type: "if"; condition: ConeColor | Flavor | Flavor[] | number }
  | { type: "pop"; flavor: Flavor | undefined };
export type StageData = {
  mission: Partial<Record<ConeColor, Flavor[]>>;
  components: Component[];
};

export const STAGES: Record<number, StageData> = {
  1: {
    mission: {
      red: ["vanilla"],
    },
    components: [{ type: "push", flavor: "vanilla" }],
  },
  2: {
    mission: {
      red: ["chocolate", "vanilla", "strawberry"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
    ],
  },
  3: {
    mission: {
      red: ["strawberry", "vanilla"],
      yellow: ["strawberry", "chocolate"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
    ],
  },
  4: {
    mission: {
      red: ["vanilla"],
      yellow: ["chocolate"],
      brown: ["strawberry"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
      { type: "if", condition: "brown" },
    ],
  },
  5: {
    mission: {
      red: ["vanilla", "chocolate", "strawberry"],
      yellow: ["chocolate", "strawberry"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
    ],
  },
  6: {
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
      { type: "pop", flavor: undefined },
    ],
  },
  7: {
    mission: {
      red: ["chocolate"],
      yellow: ["vanilla", "strawberry"],
      brown: ["vanilla", "chocolate"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
      { type: "if", condition: "yellow" },
      { type: "pop", flavor: undefined },
    ],
  },
  8: {
    mission: {
      red: ["vanilla", "vanilla", "vanilla"],
      yellow: ["chocolate", "chocolate", "chocolate"],
      brown: ["strawberry", "strawberry", "strawberry"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
      { type: "if", condition: "brown" },
      { type: "if", condition: 3 },
    ],
  },
  9: {
    mission: {
      red: ["chocolate", "vanilla", "chocolate"],
      yellow: ["vanilla", "vanilla", "vanilla"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "if", condition: "yellow" },
      { type: "if", condition: 3 },
    ],
  },
  10: {
    mission: {
      red: ["strawberry", "vanilla", "strawberry", "vanilla", "vanilla"],
      yellow: ["strawberry", "vanilla", "strawberry", "vanilla", "chocolate"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "strawberry" },
      { type: "push", flavor: "chocolate" },
      { type: "if", condition: 4 },
      { type: "if", condition: "red" },
    ],
  },
  11: {
    mission: {
      red: ["vanilla", "chocolate", "vanilla", "chocolate"],
      yellow: ["chocolate", "vanilla", "chocolate", "chocolate"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "chocolate" },
      { type: "if", condition: "yellow" },
      { type: "if", condition: 4 },
    ],
  },
  12: {
    mission: {
      red: ["chocolate", "strawberry", "vanilla"],
      yellow: ["strawberry", "vanilla", "chocolate"],
      brown: ["vanilla", "chocolate", "strawberry"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
      { type: "if", condition: "yellow" },
      { type: "if", condition: 3 },
      { type: "if", condition: 3 },
      { type: "if", condition: 3 },
    ],
  },
  14: {
    mission: {
      red: ["vanilla", "chocolate", "vanilla"],
      yellow: ["vanilla", "vanilla", "chocolate"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "chocolate" },
      { type: "if", condition: "red" },
      { type: "if", condition: ["vanilla", "vanilla"] },
      { type: "pop", flavor: undefined },
    ],
  },
  15: {
    mission: {
      red: ["chocolate", "vanilla", "chocolate", "strawberry"],
      yellow: ["vanilla", "strawberry", "chocolate"],
    },
    components: [
      { type: "if", condition: "red" },
      { type: "if", condition: 3 },
      { type: "if", condition: ["chocolate", "vanilla"] },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "push", flavor: "vanilla" },
    ],
  },
  16: {
    mission: {
      red: ["chocolate", "vanilla", "strawberry", "vanilla"],
      yellow: ["strawberry", "vanilla", "chocolate", "vanilla"],
    },
    components: [
      { type: "if", condition: "yellow" },
      { type: "if", condition: 3 },
      { type: "if", condition: ["strawberry", "vanilla"] },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "push", flavor: "vanilla" },
    ],
  },
  17: {
    mission: {
      red: ["chocolate", "strawberry", "chocolate", "vanilla"],
      yellow: [
        "chocolate",
        "strawberry",
        "chocolate",
        "strawberry",
        "chocolate",
        "strawberry",
        "vanilla",
      ],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: 6 },
      { type: "if", condition: "red" },
      { type: "if", condition: ["strawberry", "chocolate", "strawberry"] },
      { type: "pop", flavor: undefined },
    ],
  },
  18: {
    mission: {
      red: [
        "chocolate",
        "vanilla",
        "strawberry",
        "chocolate",
        "vanilla",
        "strawberry",
      ],
      yellow: [
        "vanilla",
        "strawberry",
        "chocolate",
        "vanilla",
        "strawberry",
        "chocolate",
      ],
      brown: [
        "strawberry",
        "chocolate",
        "vanilla",
        "strawberry",
        "chocolate",
        "vanilla",
      ],
    },
    components: [
      { type: "if", condition: "yellow" },
      { type: "if", condition: "red" },
      { type: "if", condition: 6 },
      { type: "if", condition: 7 },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "push", flavor: "vanilla" },
      { type: "pop", flavor: "chocolate" },
      { type: "pop", flavor: "vanilla" },
    ],
  },
  19: {
    mission: {
      red: [
        "chocolate",
        "strawberry",
        "chocolate",
        "strawberry",
        "chocolate",
        "strawberry",
      ],
      yellow: ["strawberry", "chocolate", "vanilla", "strawberry"],
      brown: ["chocolate", "vanilla", "strawberry"],
    },
    components: [
      { type: "push", flavor: "vanilla" },
      { type: "push", flavor: "chocolate" },
      { type: "push", flavor: "strawberry" },
      { type: "if", condition: "red" },
      { type: "if", condition: "yellow" },
      { type: "if", condition: ["vanilla"] },
      { type: "if", condition: 5 },
    ],
  },
};
