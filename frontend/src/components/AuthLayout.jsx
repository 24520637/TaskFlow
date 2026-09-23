import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";

export function AuthLayout({ children, title, eyebrow, footerText, footerLink, footerLabel }) {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link to="/" className="brand-link"><LogoMark /></Link>
        <div className="auth-aside__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>Make room for the work, people, and small wins that matter today.</p>
        </div>
        <div className="aside-note"><span className="aside-note__dot" />A calmer way to plan your day</div>
      </section>
      <section className="auth-panel">
        <div className="auth-panel__inner">
          {children}
          <p className="auth-footer">{footerText} <Link to={footerLink}>{footerLabel}</Link></p>
        </div>
      </section>
    </main>
  );
}
