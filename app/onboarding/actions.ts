"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { appConfiguration } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import setCookie from "set-cookie-parser";

interface AppParams {
  name: string;
  email: string;
  password: string;
  config: {
    allowSignup: boolean;
  };
}

export const generateApp = async (data: AppParams) => {
  try {
    await db.insert(appConfiguration).values(data.config);

    const res = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      asResponse: true,
    });
    const authCookie = setCookie(res.headers.get("set-cookie") as string);
    cookies().set(authCookie[0].name, authCookie[0].value, {
      maxAge: authCookie[0].maxAge,
      path: authCookie[0].path,
      httpOnly: authCookie[0].httpOnly,
    });

    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, data.email));

    return {
      status: 200,
      message: "App created successfully",
    };
  } catch (error) {
    console.log(error);
    await db.delete(appConfiguration).where(sql`id = 0`);

    return {
      status: 400,
      message: "Failed to create app",
    };
  }
};
