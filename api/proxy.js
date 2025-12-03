export default async function handler(req, res) {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbwj0Orp38yMpzfaIuVc4-DGdT3leh0IM8por07EJCmMCAIJVYqWBVrPy1XuIJUVp9g/exec";

  // CORS — ضروري ليشتغل على انستا / مسنجر / اوبرا / ايدج
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    /* --------------------------------------------------------
     * GET REQUEST
     * -------------------------------------------------------- */
    if (req.method === "GET") {
      // استخراج الـ query الأصلي بالكامل بدون تعديل
      const originalQuery = req.url.split("?")[1] || "";
      const url = API_URL + "?" + originalQuery;

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

    /* --------------------------------------------------------
     * POST REQUEST
     * -------------------------------------------------------- */
    if (req.method === "POST") {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
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
    return res.status(500).json({
      error: "Proxy Error",
      message: err.toString(),
    });
  }
}
