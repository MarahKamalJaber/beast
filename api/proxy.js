export default async function handler(req, res) {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbyFPjoeb-mDQDr3rjqgci8cG34fQpUaRGieYWiyAOJJWqs_mH6EhAmjjReHRXNjjbU/exec";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const originalQuery = req.url.split("?")[1] || "";
      const response = await fetch(API_URL + "?" + originalQuery);
      const text = await response.text();

      try { return res.status(200).json(JSON.parse(text)); }
      catch { return res.status(500).json({error:"Invalid JSON", raw:text}); }
    }

    if (req.method === "POST") {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(req.body),
      });

      const text = await response.text();
      try { return res.status(200).json(JSON.parse(text)); }
      catch { return res.status(500).json({error:"Invalid JSON", raw:text}); }
    }

    return res.status(400).json({error:"Invalid method"});

  } catch (err) {
    return res.status(500).json({error:"Proxy Error", message:err.toString()});
  }
}
