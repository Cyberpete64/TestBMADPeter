import type { Metadata } from "next";
import Link from "next/link";

import { signOutAction } from "@/app/login/actions";
import { getCurrentUser } from "@/lib/auth";
import { primaryCourse } from "@/lib/golf-course-data";

import "./globals.css";

export const metadata: Metadata = {
  title: `${primaryCourse.shortLabel} Rondapp`,
  description: `Mobilvänlig registrering och poängräkning för ronder på ${primaryCourse.displayName}.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="sv">
      <body>
        <div className="shell">
          <header className="shell__header">
            <div className="shell__header-inner">
              <Link className="shell__brand" href="/">
                <span className="shell__eyebrow">Golfapp för ronder</span>
                <span className="shell__title">{primaryCourse.shortLabel} MVP</span>
              </Link>
              <nav className="shell__nav" aria-label="Primär navigering">
                <Link className="shell__nav-link" href="/">
                  Översikt
                </Link>
                <Link className="shell__nav-link" href="/rounds/new">
                  Ny rond
                </Link>
                <Link className="shell__nav-link" href="/rounds">
                  Ronder
                </Link>
              </nav>
              <div className="shell__auth">
                {user ? (
                  <>
                    <span className="shell__user">{user.email}</span>
                    <form action={signOutAction}>
                      <button className="button-secondary" type="submit">
                        Logga ut
                      </button>
                    </form>
                  </>
                ) : (
                  <Link className="button-secondary" href="/login">
                    Logga in
                  </Link>
                )}
              </div>
            </div>
          </header>
          <main className="shell__content">{children}</main>
        </div>
      </body>
    </html>
  );
}
