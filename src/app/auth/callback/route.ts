import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function sanitizeNextPath(pathname: string | null) {
  if (!pathname || !pathname.startsWith("/") || pathname.startsWith("//")) {
    return "/";
  }

  return pathname;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next"));
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const redirectUrl = new URL("/login", origin);
      redirectUrl.searchParams.set(
        "error",
        "Länken för återställning eller inloggning kunde inte verifieras.",
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL(nextPath, origin));
}
