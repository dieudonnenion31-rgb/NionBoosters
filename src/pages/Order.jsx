import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../lib/firebase";
import GrowthRule from "../components/GrowthRule";

const functions = getFunctions(app);

export default function Order() {
  const [services, setServices] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const getServicesFn = httpsCallable(functions, "getServices");
    getServicesFn()
      .then((res) => setServices(res.data))
      .catch(() =>
        setError(
          "Catalogue indisponible pour le moment. Vérifie que la Cloud Function getServices est bien déployée."
        )
      );
  }, []);

  const service = services?.find((s) => String(s.service) === String(selected));
  const priceEstimate = service && quantity ? (Number(service.rate) * Number(quantity)) / 1000 : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const placeOrderFn = httpsCallable(functions, "placeOrder");
      await placeOrderFn({
        serviceId: service.service,
        link,
        quantity: Number(quantity),
        priceEstimate,
      });
      setSuccess("Commande envoyée au fournisseur.");
      setLink("");
      setQuantity("");
    } catch (err) {
      setError(err.message || "Échec de la commande.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="eyebrow">Nouvelle commande</p>
      <h1 className="page-title">Commande</h1>
      <p className="page-sub">Choisis un service, colle ton lien, indique la quantité.</p>
      <GrowthRule />

      {error && <div className="error-banner">{error}</div>}

      {!services && !error && <p className="empty-state">Chargement du catalogue…</p>}

      {services && (
        <form onSubmit={handleSubmit} className="card">
          <div className="field">
            <label htmlFor="service">Service</label>
            <select id="service" value={selected} onChange={(e) => setSelected(e.target.value)} required>
              <option value="">Sélectionner…</option>
              {services.map((s) => (
                <option key={s.service} value={s.service}>
                  {s.name} — {s.rate}$ / 1000
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="link">Lien</label>
            <input
              id="link"
              type="url"
              required
              placeholder="https://tiktok.com/@..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="quantity">Quantité</label>
            <input
              id="quantity"
              type="number"
              required
              min={service?.min}
              max={service?.max}
              placeholder={service ? `entre ${service.min} et ${service.max}` : ""}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {service && quantity ? (
            <div className="card" style={{ marginTop: 14 }}>
              <p className="stat-label">Estimation</p>
              <p className="stat-value" style={{ fontSize: "1.3rem" }}>
                {priceEstimate.toFixed(2)} $
              </p>
            </div>
          ) : null}

          {success && (
            <div className="card" style={{ marginTop: 14, borderColor: "var(--ink-700)" }}>
              {success}
            </div>
          )}

          <button className="btn btn-primary" disabled={busy || !selected}>
            {busy ? "Envoi…" : "Confirmer la commande"}
          </button>
        </form>
      )}
    </div>
  );
         }
