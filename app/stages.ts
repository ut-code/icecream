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
  2: {
    mission: {
      brown: ["chocolate"],
    },
    components: [
      { type: "push", flavor: "chocolate" },
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
  11: {
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
  12: {
    mission: {
      red: ["vanilla", "chocolate", "vanilla"],
      yellow: ["vanilla", "vanilla", "chocolate"]
    },
    components: [
      {type: "push", flavor: "vanilla"},
      {type: "push", flavor: "vanilla"},
      {type: "push", flavor: "chocolate"},
      {type: "push", flavor: "chocolate"},
      {type: "if", condition: "red"},
      {type: "if", condition: ["vanilla", "vanilla"]},
      {type: "pop", flavor: "chocolate"}
    ]
  },
  13: {
    mission: {
      red: ["chocolate", "strawberry", "vanilla"],
      yellow: [ "strawberry", "vanilla","chocolate"],
      brown: [ "vanilla","chocolate", "strawberry"],
    },
    components: [
      {type: "push", flavor: "vanilla"},
      {type: "push", flavor: "chocolate"},
      {type: "push", flavor: "strawberry"},
      {type: "if", condition: "red"},
      {type: "if", condition: "yellow"},
      {type: "if", condition: 3},
      {type: "if", condition: 3},
      {type: "if", condition: 3},
    ]
  },
  14: {
    mission: {
      red: ["vanilla", "vanilla", "vanilla"],
     yellow: ["chocolate", "chocolate", "chocolate"],
      brown: ["strawberry", "strawberry", "strawberry"]
    },
    components: [
      {type: "push", flavor: "vanilla"},
      {type: "push", flavor: "chocolate"},
      {type: "push", flavor: "strawberry"},
      {type: "if", condition: "red"},
      {type: "if", condition: "brown"},
      {type: "if", condition: 3}
    ]
},  15: {
    mission: {
      red: ["chocolate", "strawberry", "chocolate", "vanilla"]
    },
    components: [
      {type: "push", flavor: "vanilla"},
      {type: "push", flavor: "chocolate"},
      {type: "push", flavor: "strawberry"},
      {type: "if", condition: 6},
      {type: "if", condition: ["strawberry", "chocolate", "strawberry"]},
      {type: "pop", flavor: undefined}
    ]
},
  16: {
    mission: {
      red: ["chocolate", "strawberry" ,"chocolate", "strawberry", "chocolate", "strawberry"],
      yellow: ["strawberry", "chocolate", "vanilla", "strawberry"],
      brown: ["chocolate", "vanilla", "strawberry"]
    },
    components: [
      {type: "push", flavor: "vanilla"},
      {type: "push", flavor: "chocolate"},
      {type: "push", flavor: "strawberry"},
      {type: "if", condition: "red"},
      {type: "if", condition: "yellow"},
      {type: "if", condition: ["vanilla"]},
      {type: "if", condition: 5},
    ]
},

}
