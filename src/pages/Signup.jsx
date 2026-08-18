import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import GrowthRule from "../components/GrowthRule";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setBusy(true);
    try {
      await signup(email, password);
      navigate("/");
    } catch (err) {
      setError("Impossible de créer ce compte (e-mail déjà utilisé ?).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto 0" }}>
      <p className="eyebrow">NionBoosters</p>
      <h1 className="page-title">Créer un compte</h1>
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
            placeholder="6 caractères minimum"
          />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.88rem" }}>
        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
      </p>
    </div>
  );
        }
