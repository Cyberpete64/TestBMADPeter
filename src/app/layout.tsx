import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Golf Round Tracker",
  description: "Mobile-first golf round setup and scoring tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="shell__header">
            <div className="shell__header-inner">
              <Link className="shell__brand" href="/">
                <span className="shell__eyebrow">Golf Round Tracker</span>
                <span className="shell__title">Öfg MVP</span>
              </Link>
              <nav className="shell__nav" aria-label="Primary">
                <Link className="shell__nav-link" href="/">
                  Dashboard
                </Link>
                <Link className="shell__nav-link" href="/rounds/new">
                  New Round
                </Link>
                <Link className="shell__nav-link" href="/rounds">
                  Rounds
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
