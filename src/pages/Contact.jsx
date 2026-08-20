import { useContactSettings } from "../lib/useContactSettings";
import GrowthRule from "../components/GrowthRule";

const DEFAULTS = {
  whatsapp: "+22606338037",
  facebook: "https://www.facebook.com/profile.php?id=61593703911178",
  tiktok: "https://tiktok.com/@nion.boosters",
  email: "NionBoosters@gmail.com",
};

export default function Contact() {
  const loaded = useContactSettings();
  const settings = loaded === null ? null : { ...DEFAULTS, ...loaded };

  return (
    <div>
      <p className="eyebrow">Assistance</p>
      <h1 className="page-title">Contact</h1>
      <p className="page-sub">On te répond au plus vite.</p>
      <GrowthRule />

      {!settings ? (
        <p className="empty-state">Chargement…</p>
      ) : (
        <div className="card">
          {settings.whatsapp && (
            <div className="service-row">
              <div>
                <p className="service-name">WhatsApp</p>
                <p className="service-meta">{settings.whatsapp}</p>
              </div>
              <a
                className="btn btn-link"
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Écrire
              </a>
            </div>
          )}

          {settings.email && (
            <div className="service-row">
              <div>
                <p className="service-name">E-mail</p>
                <p className="service-meta">{settings.email}</p>
              </div>
              <a className="btn btn-link" href={`mailto:${settings.email}`}>
                Écrire
              </a>
            </div>
          )}

          {settings.facebook && (
            <div className="service-row">
              <div>
                <p className="service-name">Facebook</p>
              </div>
              <a className="btn btn-link" href={settings.facebook} target="_blank" rel="noreferrer">
                Voir la page
              </a>
            </div>
          )}

          {settings.tiktok && (
            <div className="service-row">
              <div>
                <p className="service-name">TikTok</p>
              </div>
              <a className="btn btn-link" href={settings.tiktok} target="_blank" rel="noreferrer">
                Voir le profil
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
              }
