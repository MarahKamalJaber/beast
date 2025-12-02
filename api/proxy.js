export default async function handler(req, res) {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbzg7N6xx10fg6aYfGZ9Tz6qQg4sXfOYXckY89BCPKKyr9hW3-9MJ3czqjWK9Qs2rUY/exec";

  // CORS headers عشان المتصفح ما يمنع الطلبات
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const url = API_URL + "?" + new URLSearchParams(req.query).toString();
      const response = await fetch(url);
      const text = await response.text();

      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Invalid JSON from Apps Script", raw: text });
      }
    }

    if (req.method === "POST") {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch (e) {
        return res
          .status(500)
          .json({ error: "Invalid JSON from Apps Script", raw: text });
      }
    }

    return res.status(400).json({ error: "Invalid method" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Proxy Error", message: err.toString() });
  }
}
