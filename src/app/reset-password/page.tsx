import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPasswordPolicyHint } from "@/lib/password-policy";

import { updatePasswordAction } from "./actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?error=Öppna återställningslänken från mejlet igen.");
  }

  const { error } = await searchParams;
  const passwordPolicyHint = getPasswordPolicyHint();

  return (
    <div className="auth-layout">
      <section className="auth-hero page-card">
        <span className="pill">Återställ lösenord</span>
        <h1 className="page-title">Välj ett nytt lösenord</h1>
        <p className="page-intro">
          Du är nu verifierad via länken från Supabase. Sätt ett nytt lösenord
          och logga sedan in som vanligt.
        </p>
      </section>

      {error ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {error}
        </div>
      ) : null}

      <form action={updatePasswordAction} className="page-card form-grid">
        <div className="field">
          <label htmlFor="password">Nytt lösenord</label>
          <input
            autoComplete="new-password"
            id="password"
            name="password"
            type="password"
          />
          <div className="field__hint">{passwordPolicyHint}</div>
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Bekräfta nytt lösenord</label>
          <input
            autoComplete="new-password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
          />
        </div>

        <button className="button" type="submit">
          Spara nytt lösenord
        </button>

        <Link className="button-secondary" href="/login">
          Tillbaka till login
        </Link>
      </form>
    </div>
  );
}
