import { drizzle } from "drizzle-orm/libsql/node";

if (!process.env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}

export const db = drizzle({
  connection: {
    url: process.env.DB_FILE_NAME as string,
  },
});
