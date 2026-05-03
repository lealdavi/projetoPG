import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "no-cache-static",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cache-Control", "no-store");
          next();
        });
      },
    },
  ],
});
