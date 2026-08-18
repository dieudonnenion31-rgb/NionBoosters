import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import GrowthRule from "../components/GrowthRule";

export default function Activity() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "orders"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  return (
    <div>
      <p className="eyebrow">Historique</p>
      <h1 className="page-title">Activité</h1>
      <p className="page-sub">Tes commandes passées et leur statut.</p>
      <GrowthRule />

      {orders.length === 0 ? (
        <div className="card">
          <p className="empty-state">Aucune commande pour l'instant.</p>
        </div>
      ) : (
        <div className="card">
          {orders.map((o) => (
            <div className="service-row" key={o.id}>
              <div>
                <p className="service-name">Lien : {o.link}</p>
                <p className="service-meta">
                  Qté {o.quantity} · {o.status}
                </p>
              </div>
              <p className="service-rate">{o.priceEstimate?.toFixed(2)} $</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
      }
