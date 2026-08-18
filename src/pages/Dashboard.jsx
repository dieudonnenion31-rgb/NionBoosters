import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import GrowthRule from "../components/GrowthRule";

export default function Dashboard() {
  const { profile } = useAuth();
  const balance = profile?.balance ?? 0;
  const currency = profile?.currency ?? "XOF";

  return (
    <div>
      <p className="eyebrow">Votre espace</p>
      <h1 className="page-title">Tableau de bord</h1>
      <p className="page-sub">Solde, commandes et prochaine étape.</p>
      <GrowthRule />

      <div className="card">
        <p className="stat-label">Solde disponible</p>
        <p className="stat-value">
          {balance.toLocaleString("fr-FR")} {currency}
        </p>
      </div>

      <div className="card">
        <p className="stat-label">Commandes actives</p>
        <p className="stat-value">0</p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1rem" }}>Passer votre première commande</h3>
        <p className="page-sub" style={{ marginTop: 6 }}>
          Choisissez un service, collez votre lien, indiquez la quantité.
        </p>
        <Link to="/commande" className="btn btn-primary" style={{ textDecoration: "none" }}>
          Commander
        </Link>
      </div>
    </div>
  );
}
