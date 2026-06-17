import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@db/schema";

let pool: mysql.Pool | undefined;
let instance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;

    if (dbUrl) {
      // Conexión via URL (Railway u otro servicio en la nube)
      const url = new URL(dbUrl);
      pool = mysql.createPool({
        host: url.hostname,
        port: parseInt(url.port || "3306"),
        user: url.username,
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ""),
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 10000,
      });
    } else {
      // Conexión local (XAMPP)
      pool = mysql.createPool({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "",
        database: "catalogo_db",
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 10000,
      });
    }
  }

  if (!instance) {
    instance = drizzle(pool, { schema, mode: "default" });
  }

  return instance;
}
