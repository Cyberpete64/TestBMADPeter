"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import {
  getPasswordPolicyHint,
  validatePasswordAgainstPolicy,
} from "@/lib/password-policy";
import { createClient } from "@/lib/supabase/server";

function readStringField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeNextPath(pathname: string) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) {
    return "/";
  }

  if (pathname.startsWith("/login")) {
    return "/";
  }

  return pathname;
}

function buildRedirect(pathname: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString === "" ? pathname : `${pathname}?${queryString}`;
}

function toFriendlyAuthErrorMessage(message: string, fallback: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("password")) {
    return `Lösenordet uppfyller inte kraven. ${getPasswordPolicyHint()}`;
  }

  if (normalized.includes("email") && normalized.includes("disabled")) {
    return "E-postinloggning är inte aktiverad i Supabase-projektet.";
  }

  if (
    normalized.includes("email") &&
    (normalized.includes("not confirmed") || normalized.includes("confirmation"))
  ) {
    return "Kontot finns, men e-postadressen behöver bekräftas innan du kan logga in.";
  }

  if (normalized.includes("rate limit") || normalized.includes("security purposes")) {
    return "Supabase spärrade försöket tillfälligt. Vänta en stund och försök igen.";
  }

  if (normalized.includes("redirect")) {
    return "Redirect-URL:en är inte tillåten i Supabase Auth-inställningarna.";
  }

  return `${fallback} (${message})`;
}

function extractAuthErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeMessage =
      "message" in error && typeof error.message === "string"
        ? error.message
        : null;
    const maybeCode =
      "code" in error && typeof error.code === "string" ? error.code : null;
    const maybeStatus =
      "status" in error && typeof error.status === "number"
        ? String(error.status)
        : null;

    const details = [maybeMessage, maybeCode, maybeStatus].filter(Boolean).join(" / ");

    if (details !== "") {
      return details;
    }
  }

  return "Okänt fel från Supabase Auth";
}

export async function signInAction(formData: FormData) {
  const email = readStringField(formData, "email");
  const password = readStringField(formData, "password");
  const nextPath = sanitizeNextPath(readStringField(formData, "next"));

  if (email === "" || password === "") {
    redirect(
      buildRedirect("/login", {
        error: "Fyll i både e-post och lösenord.",
        next: nextPath === "/" ? undefined : nextPath,
      }),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      buildRedirect("/login", {
        error: toFriendlyAuthErrorMessage(
          error.message,
          "Inloggningen misslyckades",
        ),
        next: nextPath === "/" ? undefined : nextPath,
      }),
    );
  }

  redirect(nextPath);
}

export async function signUpAction(formData: FormData) {
  const email = readStringField(formData, "signupEmail");
  const password = readStringField(formData, "signupPassword");

  if (email === "" || password === "") {
    redirect(
      buildRedirect("/login", {
        error: "Fyll i både e-post och lösenord för att skapa konto.",
      }),
    );
  }

  const passwordErrors = validatePasswordAgainstPolicy(password);

  if (passwordErrors.length > 0) {
    redirect(
      buildRedirect("/login", {
        error: `Lösenordet uppfyller inte kraven: ${passwordErrors.join(", ")}.`,
      }),
    );
  }

  try {
    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? "";
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: origin
        ? {
            emailRedirectTo: `${origin}/login`,
          }
        : undefined,
    });

    if (error) {
      const details = extractAuthErrorDetails(error);
      console.error("Supabase signUp error:", details);
      redirect(
        buildRedirect("/login", {
          error: toFriendlyAuthErrorMessage(
            details,
            "Kontot kunde inte skapas just nu",
          ),
        }),
      );
    }

    if (data.session) {
      redirect("/");
    }

    redirect(
      buildRedirect("/login", {
        message:
          "Kontot skapades. Bekräfta din e-postadress i Supabase-mejlet innan du loggar in.",
      }),
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const details = extractAuthErrorDetails(error);
    console.error("Supabase signUp exception:", details);
    redirect(
      buildRedirect("/login", {
        error: `Kontot kunde inte skapas just nu (${details})`,
      }),
    );
  }
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = readStringField(formData, "recoveryEmail");

  if (email === "") {
    redirect(
      buildRedirect("/login", {
        error: "Ange din e-postadress för att återställa lösenordet.",
      }),
    );
  }

  try {
    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? "";
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: origin
        ? `${origin}/auth/callback?next=/reset-password`
        : undefined,
    });

    if (error) {
      const details = extractAuthErrorDetails(error);
      console.error("Supabase password reset error:", details);
      redirect(
        buildRedirect("/login", {
          error: toFriendlyAuthErrorMessage(
            details,
            "Återställningsmejlet kunde inte skickas",
          ),
        }),
      );
    }

    redirect(
      buildRedirect("/login", {
        message:
          "Om e-postadressen finns i Supabase skickas nu ett återställningsmejl.",
      }),
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const details = extractAuthErrorDetails(error);
    console.error("Supabase password reset exception:", details);
    redirect(
      buildRedirect("/login", {
        error: `Återställningsmejlet kunde inte skickas (${details})`,
      }),
    );
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
