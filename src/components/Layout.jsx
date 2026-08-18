import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function Layout() {
  const { profile, logout } = useAuth();
  const balance = profile?.balance ?? 0;
  const currency = profile?.currency ?? "XOF";

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">NionBoosters</span>
        <span className="wallet">
          {balance.toLocaleString("fr-FR")} {currency}
        </span>
        <button
          onClick={logout}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            fontSize: "0.78rem",
            cursor: "pointer",
            opacity: 0.85,
          }}
        >
          Déconnexion
        </button>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="tabbar">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          <span>🏠</span>
          Accueil
        </NavLink>
        <NavLink to="/commande" className={({ isActive }) => (isActive ? "active" : "")}>
          <span>➕</span>
          Commande
        </NavLink>
        <NavLink to="/activite" className={({ isActive }) => (isActive ? "active" : "")}>
          <span>📋</span>
          Activité
        </NavLink>
        <NavLink to="/compte" className={({ isActive }) => (isActive ? "active" : "")}>
          <span>👤</span>
          Compte
        </NavLink>
      </nav>
    </div>
  );
      }
