import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", {
    mode: "boolean",
  }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updatedAt", {
    mode: "timestamp",
  }).notNull(),
  role: text("role"),
  banned: integer("banned", {
    mode: "boolean",
  }),
  banReason: text("banReason"),
  banExpires: integer("banExpires", {
    mode: "timestamp",
  }),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  impersonatedBy: text("impersonatedBy"),
  activeOrganizationId: text("activeOrganizationId"),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }),
  password: text("password"),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
});

export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  metadata: text("metadata"),
});

export const member = sqliteTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id),
  userId: text("userId").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
});

export const invitation = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organization.id),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  inviterId: text("inviterId")
    .notNull()
    .references(() => user.id),
});
