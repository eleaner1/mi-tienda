import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: dbUrl
    ? { url: dbUrl }
    : {
        host: "localhost",
        port: 3306,
        user: "root",
        database: "catalogo_db",
      },
});
