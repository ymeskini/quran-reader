import index from "./index.html";
import { apiRoutes } from "./api/routes";

Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    ...apiRoutes,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Quran Reader running at http://localhost:3000");
