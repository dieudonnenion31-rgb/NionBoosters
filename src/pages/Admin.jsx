import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import GrowthRule from "../components/GrowthRule";

const OWNER_UIDS = ["msjoafHyY4Ry9dGvPgWHLZHLoGg2", "mS8pRTBizyV81JZ7X6ggTHE0zlg2"];

export default function Admin() {
  const { user } = useAuth();
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ref = doc(db, "settings", "contact");
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setWhatsapp(data.whatsapp || "");
        setFacebook(data.facebook || "");
        setTiktok(data.tiktok || "");
        setEmail(data.email || "");
      }
    });
  }, []);

  if (!OWNER_UIDS.includes(user?.uid)) {
    return (
      <div>
        <p className="eyebrow">Accès refusé</p>
        <h1 className="page-title">Réservé à l'administrateur</h1>
        <GrowthRule />
      </div>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await setDoc(doc(db, "settings", "contact"), {
        whatsapp,
        facebook,
        tiktok,
        email,
      });
      setSaved(true);
    } catch (err) {
      setError("Échec de l'enregistrement. Vérifie tes règles Firestore.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="eyebrow">Administration</p>
      <h1 className="page-title">Infos de contact</h1>
      <p className="page-sub">Ce que tes clients voient sur le site.</p>
      <GrowthRule />

      <form onSubmit={handleSave} className="card">
        <div className="field">
          <label htmlFor="whatsapp">Numéro WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+22606338037"
          />
        </div>

        <div className="field">
          <label htmlFor="facebook">Lien Facebook</label>
          <input
            id="facebook"
            type="url"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="field">
          <label htmlFor="tiktok">Lien TikTok</label>
          <input
            id="tiktok"
            type="url"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="https://tiktok.com/@..."
          />
        </div>

        <div className="field">
          <label htmlFor="email">E-mail de contact</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@nionboosters.com"
          />
        </div>

        {error && <div className="error-banner">{error}</div>}
        {saved && (
          <div className="card" style={{ marginTop: 14, borderColor: "var(--ink-700)" }}>
            Enregistré.
          </div>
        )}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
      }
