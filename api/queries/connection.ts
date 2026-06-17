import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@db/schema";

let pool: mysql.Pool | undefined;
let instance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "catalogo_db",
    });
  }

  if (!instance) {
    instance = drizzle(pool, {
      schema,
      mode: "default",
    });
  }

  return instance;
}