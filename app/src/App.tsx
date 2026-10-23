import { formatDate, todayISO } from './lib/dates';
import { ThemeToggle } from './components/ThemeToggle';

export function App() {
  const today = todayISO();
  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="shell__header">
        <p className="shell__brand">Client Desk</p>
        <p className="shell__org">
          <span className="cd-sr-only">Organisation: </span>Silicon Route
        </p>
      </header>
      <main id="main" className="shell__main" tabIndex={-1}>
        <h1 className="shell__title">Dashboard</h1>
        <section className="cd-panel" aria-labelledby="status-title">
          <h2 className="cd-panel__title" id="status-title">The app is live</h2>
          <p className="shell__text">
            Today is <strong>{formatDate(today)}</strong> in Johannesburg. This is the Phase 0 placeholder. Sign-in, clients and
            tasks arrive in Phase 1.
          </p>
          <p className="shell__text">
            You can install it now: in Chrome on Android, open the menu and choose <strong>Add to Home screen</strong>.
          </p>
        </section>
        <section className="cd-panel" aria-labelledby="settings-title">
          <h2 className="cd-panel__title" id="settings-title">Display</h2>
          <ThemeToggle />
        </section>
      </main>
    </div>
  );
}
