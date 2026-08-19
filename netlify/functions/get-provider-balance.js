exports.handler = async function () {
  try {
    const res = await fetch("https://smm.africa/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: process.env.SMM_AFRICA_API_KEY,
        action: "balance",
      }),
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Erreur serveur." }) };
  }
};
