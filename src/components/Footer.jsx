import { Link } from "react-router-dom";
import { useContactSettings } from "../lib/useContactSettings";

export default function Footer() {
  const settings = useContactSettings();
  if (!settings) return null;

  return (
    <footer className="site-footer">
      <div className="footer-links">
        {settings.whatsapp && (
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        )}
        {settings.facebook && (
          <a href={settings.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
        {settings.tiktok && (
          <a href={settings.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        )}
        <Link to="/contact">Contact</Link>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} NionBoosters</p>
    </footer>
  );
}
