export default async function handler(req, res) {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbzMrx_znp6aDIeFumMds_UIQ5MeT4yTn6lgZYRnBNo8X5-xGNk-OQ1z_ayqYVXU7es/exec";

  try {
    let url = API_URL;

    if (req.method === "GET") {
      url += "?" + new URLSearchParams(req.query).toString();
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
