import { z } from "zod";

const env = z
  .object({
    DATABASE_URL: z.string().default("./webgridplus.sqlite"),
    SESSION_SECRET: z.string().default("development-secret"),
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
    NODE_ENV: z.string().default("development"),
  })
  .parse(process.env);

export const ENV = {
  DATABASE_URL: env.DATABASE_URL,
  SESSION_SECRET: env.SESSION_SECRET,
  NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: env.NODE_ENV,
};
