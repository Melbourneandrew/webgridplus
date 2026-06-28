import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "src/infrastructure/db/migrations",
  schema: "./src/infrastructure/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./webgridplus.sqlite",
  },
});
