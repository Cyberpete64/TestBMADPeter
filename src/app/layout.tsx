import type { Metadata } from "next";
import Link from "next/link";

import { primaryCourse } from "@/lib/golf-course-data";

import "./globals.css";

export const metadata: Metadata = {
  title: `${primaryCourse.shortLabel} Rondapp`,
  description: `Mobilvänlig registrering och poängräkning för ronder på ${primaryCourse.displayName}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            </div>
          </header>
          <main className="shell__content">{children}</main>
        </div>
      </body>
    </html>
  );
}
