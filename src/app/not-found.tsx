import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-stack">
      <section className="empty-card">
        <span className="pill">Sidan hittades inte</span>
        <h1 className="page-title">Den här sidan finns inte.</h1>
        <p className="page-intro">
          Länken kan vara fel eller så har sidan flyttats. Gå tillbaka till
          översikten eller fortsätt med en ny rond.
        </p>
        <div className="actions-row">
          <Link className="button" href="/">
            Till översikten
          </Link>
          <Link className="button-secondary" href="/rounds/new">
            Starta ny rond
          </Link>
        </div>
      </section>
    </div>
  );
}
