import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("select-stage", "routes/selectStage.tsx"),
  route("how-to-play", "routes/howToPlay.tsx"),
  route("stage/:id", "routes/stage.$id.tsx"),
] satisfies RouteConfig;
