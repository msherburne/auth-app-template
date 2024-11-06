import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

interface MatcherConfig {
  exact?: boolean;
  type?: "all" | "any";
}
class Matcher {
  pathname: string;

  constructor(public request: NextRequest) {
    this.pathname = request.nextUrl.pathname;
  }

  match(
    paths: string | string[],
    config: MatcherConfig = { exact: false, type: "any" }
  ): boolean {
    if (typeof paths === "string") {
      if (config.exact) {
        return this.pathname === paths;
      }
      return this.pathname.startsWith(paths);
    } else if (Array.isArray(paths)) {
      if (config.type === "all") {
        return paths.every((path) => this.match(path, config));
      } else if (config.type === "any") {
        return paths.some((path) => this.match(path, config));
      } else {
        throw new Error("Invalid type in configuration");
      }
    } else {
      throw new Error("Invalid paths");
    }
  }
}

export default async function authMiddleware(request: NextRequest) {
  const matcher = new Matcher(request);

  type IsInitialized = { status: boolean };

  const { data: isInitialized } = await betterFetch<IsInitialized>(
    "/api/onboarding",
    {
      baseURL: request.nextUrl.origin,
    }
  );

  if (!isInitialized?.status) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (matcher.match("/onboarding") && isInitialized?.status) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (matcher.match("/onboarding")) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: request.headers,
    }
  );

  if (matcher.match("/auth")) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } else {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
