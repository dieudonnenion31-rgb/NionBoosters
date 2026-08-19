import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useContactSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const ref = doc(db, "settings", "contact");
    const unsub = onSnapshot(ref, (snap) => {
      setSettings(snap.exists() ? snap.data() : {});
    });
    return unsub;
  }, []);

  return settings;
}
