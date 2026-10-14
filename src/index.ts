import { serve } from "bun";
import index from "./index.html";
import {
  handleMovies,
  handleMovieById,
  handleGenres,
} from "@/server/endpoints";
import cache from "@/server/services/cache";

type Handler = (req: Bun.BunRequest) => Response | Promise<Response>;

function loggerMiddleware(handler: Handler) {
  return async (req: Bun.BunRequest) => {
    const start = performance.now();
    const res = await handler(req);
    const ms = Math.round(performance.now() - start);
    const { method, url } = req;
    console.log(
      `${new Date().toISOString()} ${method} ${new URL(url).toString()} ${res.status} ${ms}ms`,
    );
    return res;
  };
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/movies": loggerMiddleware(handleMovies),
    "/api/movies/:id": loggerMiddleware(handleMovieById),
    "/api/genres": loggerMiddleware(handleGenres),
  },
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

// run a cron every minute
Bun.cron("* * * * *", () => {
  cache.clearExpired();
});

console.log(`🚀 Server running at ${server.url}`);
