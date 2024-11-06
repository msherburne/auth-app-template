import { db } from "@/lib/db";
import { appConfiguration } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export const GET = async () => {
  const isInitialized = !!(await db.$count(appConfiguration));

  return NextResponse.json({
    status: isInitialized,
  });
};
