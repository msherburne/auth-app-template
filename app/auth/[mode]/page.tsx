import { appConfiguration } from "@/lib/db/schema";
import TabAuth from "./tabs";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function generateStaticParams() {
  const modes = ["login", "signup"];

  return modes.map((mode) => ({
    mode: mode,
  }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  const isSignupAllowed = (
    await db
      .select({
        allowSignup: appConfiguration.allowSignup,
      })
      .from(appConfiguration)
      .where(sql`id = 1`)
      .limit(1)
      .execute()
  )[0].allowSignup;
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <TabAuth mode={mode} />
    </div>
  );
}
