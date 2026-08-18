import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import GrowthRule from "../components/GrowthRule";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Adresse e-mail ou mot de passe incorrect.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto 0" }}>
      <p className="eyebrow">NionBoosters</p>
      <h1 className="page-title">Connexion</h1>
      <GrowthRule />

      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.88rem" }}>
        Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </div>
  );
    }
