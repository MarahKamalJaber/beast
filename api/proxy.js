export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  
  const API_URL = "https://script.google.com/macros/s/AKfycbxeqpPZiXMMeB_ecK-DXmYn-5zdiLYNkcQYDCllsBe_WMXIYp7qsfx7HlI1YB1zMDU/exec";

  try {
    if (req.method === "GET") {
      const url = API_URL + "?" + new URLSearchParams(req.query).toString();
      const response = await fetch(url);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: "Invalid method" });

  } catch (err) {
    return res.status(500).json({ error: "Proxy error", details: err.toString() });
  }
}
