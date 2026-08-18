const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const SMM_AFRICA_API_KEY = defineSecret("SMM_AFRICA_API_KEY");
const SMM_AFRICA_URL = "https://smm.africa/api/v3";

async function callSmmAfrica(action, extra = {}) {
  const res = await fetch(SMM_AFRICA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: SMM_AFRICA_API_KEY.value(),
      action,
      ...extra,
    }),
  });
  const data = await res.json();
  if (data.error) {
    throw new HttpsError("failed-precondition", data.error);
  }
  return data;
}

exports.getServices = onCall({ secrets: [SMM_AFRICA_API_KEY] }, async () => {
  return callSmmAfrica("services");
});

exports.placeOrder = onCall({ secrets: [SMM_AFRICA_API_KEY] }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Connexion requise.");
  }
  const { serviceId, link, quantity, priceEstimate } = request.data;
  if (!serviceId || !link || !quantity) {
    throw new HttpsError("invalid-argument", "Champs manquants.");
  }

  const userRef = db.collection("users").doc(request.auth.uid);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const balance = snap.data()?.balance ?? 0;
    if (balance < priceEstimate) {
      throw new HttpsError("failed-precondition", "Solde insuffisant.");
    }
    tx.update(userRef, {
      balance: admin.firestore.FieldValue.increment(-priceEstimate),
    });
  });

  const result = await callSmmAfrica("add", {
    prestation: serviceId,
    link,
    quantity,
  });

  await db.collection("orders").add({
    uid: request.auth.uid,
    serviceId,
    link,
    quantity,
    priceEstimate,
    providerOrderId: result.order ?? null,
    status: "en_cours",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return result;
});

exports.getProviderBalance = onCall({ secrets: [SMM_AFRICA_API_KEY] }, async () => {
  return callSmmAfrica("balance");
});
