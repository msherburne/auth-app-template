import { NextResponse } from "next/server";

export const GET = (request: Request) => {
  return NextResponse.redirect(new URL("/auth/login", request.url));
};
