import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import GrowthRule from "../components/GrowthRule";

const OWNER_UIDS = ["msjoafHyY4Ry9dGvPgWHLZHLoGg2", "mS8pRTBizyV81JZ7X6ggTHE0zlg2"];

export default function Account() {
  const { user, profile } = useAuth();

  return (
    <div>
      <p className="eyebrow">Ton profil</p>
      <h1 className="page-title">Compte</h1>
      <GrowthRule />

      <div className="card">
        <p className="stat-label">E-mail</p>
        <p style={{ marginTop: 4 }}>{user?.email}</p>
      </div>

      <div className="card">
        <p className="stat-label">Solde</p>
        <p className="stat-value">
          {(profile?.balance ?? 0).toLocaleString("fr-FR")} {profile?.currency ?? "XOF"}
        </p>
        <p className="page-sub" style={{ marginTop: 8 }}>
          La recharge de solde (paiement en ligne) arrive bientôt.
        </p>
      </div>

      {OWNER_UIDS.includes(user?.uid) && (
        <Link to="/admin" className="btn btn-primary" style={{ textDecoration: "none" }}>
          Administration
        </Link>
      )}
    </div>
  );
}
