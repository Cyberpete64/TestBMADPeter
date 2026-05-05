"use server";

import { redirect } from "next/navigation";

import { validatePasswordAgainstPolicy } from "@/lib/password-policy";
import { createClient } from "@/lib/supabase/server";

function readStringField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
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

export async function updatePasswordAction(formData: FormData) {
  const password = readStringField(formData, "password");
  const confirmPassword = readStringField(formData, "confirmPassword");
  const passwordErrors = validatePasswordAgainstPolicy(password);

  if (passwordErrors.length > 0) {
    redirect(
      buildRedirect("/reset-password", {
        error: `Lösenordet uppfyller inte kraven: ${passwordErrors.join(", ")}.`,
      }),
    );
  }

  if (password !== confirmPassword) {
    redirect(
      buildRedirect("/reset-password", {
        error: "Lösenorden matchar inte varandra.",
      }),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      buildRedirect("/reset-password", {
        error: `Lösenordet kunde inte uppdateras (${error.message})`,
      }),
    );
  }

  redirect(
    buildRedirect("/login", {
      message: "Lösenordet är uppdaterat. Du kan nu logga in med det nya lösenordet.",
    }),
  );
}
