import { useNavigate } from "react-router-dom";
import { LogoMark } from "../components/LogoMark";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  function handleSignOut() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <LogoMark />
        <div className="app-header__right">
          <div className="user-chip"><span>{user?.name?.charAt(0).toUpperCase()}</span><strong>{user?.name}</strong></div>
          <button className="text-button" onClick={handleSignOut}>Log out <span aria-hidden="true">↗</span></button>
        </div>
      </header>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Today, September 23</p>
          <h1>Good morning,<br /><em>{firstName}.</em></h1>
        </div>
        <div className="hero-mark" aria-hidden="true">✳</div>
      </section>
      <section className="dashboard-grid">
        <article className="welcome-card">
          <div className="card-kicker">Your workspace</div>
          <h2>A clear place<br />for your <em>next move.</em></h2>
          <p>Tasks, priorities, and progress will live here. Your calendar is coming soon.</p>
          <div className="card-line" />
          <span className="coming-label">Workspace ready <b>•</b> 01</span>
        </article>
        <div className="stats-column">
          <article className="stat-card"><span className="stat-card__label">Tasks today</span><strong>—</strong><small>Nothing added yet</small></article>
          <article className="stat-card stat-card--dark"><span className="stat-card__label">Your focus</span><strong>Start<br />small.</strong><small>One step at a time</small></article>
        </div>
      </section>
    </main>
  );
}
