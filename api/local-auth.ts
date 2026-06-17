import * as cookie from "cookie";
import { eq } from "drizzle-orm";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";

export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const unionId = cookies[Session.cookieName];

  if (!unionId) {
    throw Errors.forbidden("Invalid authentication token.");
  }

  const rows = await getDb()
    .select()
    .from(users)
    .where(eq(users.unionId, unionId))
    .limit(1);

  const user = rows.at(0);

  if (!user) {
    throw Errors.forbidden("User not found.");
  }

  return user;
}