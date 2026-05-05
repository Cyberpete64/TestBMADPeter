import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

const publicPaths = new Set(["/login", "/reset-password"]);

function isPublicPath(pathname: string) {
  return (
    publicPaths.has(pathname) ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  );
}

function sanitizeNextPath(pathname: string | null) {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return "/";
  }

  if (pathname.startsWith("/login")) {
    return "/";
  }

  return pathname;
}

function redirectWithCookies(
  response: NextResponse,
  request: NextRequest,
  pathname: string,
  searchParams?: URLSearchParams,
) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = pathname;
  redirectUrl.search = searchParams?.toString() ?? "";

  const redirectResponse = NextResponse.redirect(redirectUrl);

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const searchParams = new URLSearchParams();
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    if (nextPath !== "/") {
      searchParams.set("next", nextPath);
    }

    return redirectWithCookies(response, request, "/login", searchParams);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const searchParams = request.nextUrl.searchParams;
    const nextPath = sanitizeNextPath(searchParams.get("next"));
    return redirectWithCookies(response, request, nextPath);
  }

  return response;
}
