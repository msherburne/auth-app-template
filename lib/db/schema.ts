import { sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const appConfiguration = sqliteTable("appConfig", {
  id: integer("id").default(1).unique(),
  allowSignup: integer({ mode: "boolean" }).default(true),
});
