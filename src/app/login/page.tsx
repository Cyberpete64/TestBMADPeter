import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getPasswordPolicyHint } from "@/lib/password-policy";

import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
} from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  const { error, message, next } = await searchParams;
  const passwordPolicyHint = getPasswordPolicyHint();

  return (
    <div className="auth-layout">
      <section className="auth-hero page-card">
        <span className="pill">Supabase-inloggning</span>
        <h1 className="page-title">Logga in för att se dina ronder</h1>
        <p className="page-intro">
          Appen använder nu Supabase Auth och Postgres, så varje användare ser
          bara sina egna sparade scorekort och sin egen statistik.
        </p>
      </section>

      {error ? (
        <div aria-live="assertive" className="form-error" role="alert">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="form-success" role="status">
          {message}
        </div>
      ) : null}

      <section className="auth-grid">
        <form action={signInAction} className="page-card form-grid">
          <div className="step-header">
            <span className="pill">Logga in</span>
            <h2>Öppna din rondhistorik</h2>
            <p className="muted">
              Använd den e-postadress och det lösenord som finns i Supabase Auth.
            </p>
          </div>

          <input name="next" type="hidden" value={next ?? ""} />

          <div className="field">
            <label htmlFor="email">E-post</label>
            <input autoComplete="email" id="email" name="email" type="email" />
          </div>

          <div className="field">
            <label htmlFor="password">Lösenord</label>
            <input
              autoComplete="current-password"
              id="password"
              name="password"
              type="password"
            />
          </div>

          <button className="button" type="submit">
            Logga in
          </button>
        </form>

        <form action={signUpAction} className="page-card form-grid">
          <div className="step-header">
            <span className="pill">Skapa konto</span>
            <h2>Skapa en egen inloggning</h2>
            <p className="muted">
              Om e-postbekräftelse är aktiverad i Supabase behöver du bekräfta
              adressen innan första inloggningen.
            </p>
          </div>

          <div className="field">
            <label htmlFor="signupEmail">E-post</label>
            <input
              autoComplete="email"
              id="signupEmail"
              name="signupEmail"
              type="email"
            />
          </div>

          <div className="field">
            <label htmlFor="signupPassword">Lösenord</label>
            <input
              autoComplete="new-password"
              id="signupPassword"
              name="signupPassword"
              type="password"
            />
            <div className="field__hint">{passwordPolicyHint}</div>
          </div>

          <button className="button-secondary" type="submit">
            Skapa konto
          </button>
        </form>
      </section>

      <form action={requestPasswordResetAction} className="page-card form-grid">
        <div className="step-header">
          <span className="pill">Glömt lösenord</span>
          <h2>Skicka återställningsmejl</h2>
          <p className="muted">
            Ange din e-postadress så skickar Supabase en länk som leder till
            appens sida för att sätta ett nytt lösenord.
          </p>
        </div>

        <div className="field">
          <label htmlFor="recoveryEmail">E-post</label>
          <input
            autoComplete="email"
            id="recoveryEmail"
            name="recoveryEmail"
            type="email"
          />
        </div>

        <button className="button-secondary" type="submit">
          Skicka återställningslänk
        </button>
      </form>
    </div>
  );
}
