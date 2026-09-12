import { type NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";

/**
 * Middleware runs at the Edge — amplify_outputs.json is read via env vars
 * injected by Amplify Hosting at deploy time, or absent during local dev
 * before sandbox is started (in which case all protected routes redirect to /login).
 */
const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: {
      Cognito: {
        userPoolId: process.env["NEXT_PUBLIC_USER_POOL_ID"] ?? "",
        userPoolClientId: process.env["NEXT_PUBLIC_USER_POOL_CLIENT_ID"] ?? "",
      },
    },
  },
});

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/unauthorised"];

const ROLE_PATHS: Record<string, string[]> = {
  "/parent": ["parent", "admin"],
  "/child": ["child", "parent", "admin"],
  "/staff": ["content_author", "reviewer", "admin"],
  "/admin": ["admin"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Skip middleware if Cognito is not yet configured (no sandbox running)
  if (!process.env["NEXT_PUBLIC_USER_POOL_ID"]) {
    return NextResponse.next();
  }

  try {
    const response = NextResponse.next();
    const session = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });

    if (!session.tokens) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const groups =
      (session.tokens.accessToken.payload["cognito:groups"] as string[] | undefined) ?? [];

    for (const [prefix, allowed] of Object.entries(ROLE_PATHS)) {
      if (pathname.startsWith(prefix)) {
        if (!allowed.some((r) => groups.includes(r))) {
          return NextResponse.redirect(new URL("/unauthorised", request.url));
        }
      }
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)"],
};
