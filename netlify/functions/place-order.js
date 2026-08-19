const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}
const db = admin.firestore();

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Méthode non autorisée." };
  }

  try {
    const authHeader = event.headers.authorization || "";
    const idToken = authHeader.replace("Bearer ", "");
    if (!idToken) {
      return { statusCode: 401, body: JSON.stringify({ error: "Connexion requise." }) };
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const { serviceId, link, quantity, priceEstimate } = JSON.parse(event.body || "{}");
    if (!serviceId || !link || !quantity) {
      return { statusCode: 400, body: JSON.stringify({ error: "Champs manquants." }) };
    }

    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const balance = snap.data()?.balance ?? 0;
      if (balance < priceEstimate) {
        throw new Error("Solde insuffisant.");
      }
      tx.update(userRef, {
        balance: admin.firestore.FieldValue.increment(-priceEstimate),
      });
    });

    const res = await fetch("https://smm.africa/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: process.env.SMM_AFRICA_API_KEY,
        action: "add",
        prestation: serviceId,
        link,
        quantity,
      }),
    });
    const result = await res.json();

    if (result.error) {
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(priceEstimate),
      });
      return { statusCode: 400, body: JSON.stringify({ error: result.error }) };
    }

    await db.collection("orders").add({
      uid,
      serviceId,
      link,
      quantity,
      priceEstimate,
      providerOrderId: result.order ?? null,
      status: "en_cours",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: err.message || "Échec de la commande." }) };
  }
};
