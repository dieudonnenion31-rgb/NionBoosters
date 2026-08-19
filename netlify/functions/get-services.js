exports.handler = async function () {
  try {
    const res = await fetch("https://smm.africa/api/v3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: process.env.SMM_AFRICA_API_KEY,
        action: "services",
      }),
    });
    const data = await res.json();

    if (data.error) {
      return { statusCode: 400, body: JSON.stringify({ error: data.error }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Erreur serveur." }) };
  }
};
