export default async function handler(req, res) {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbxf7ZT-HvbSLS5yYmOOmhca4Bdnu0GmV7KwnE5-ueX92mDSfuWlaYHJdzWYokwaWwU/exec";

  // CORS — مهم لفتح اللعبة من إنستا / مسنجر / تطبيقات خارجية
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    /* --------------------------------------------------------
     * GET REQUEST
     * نستخدمه لفحص الجهاز + الرقم + ip
     * ------------------------------------------------------ */
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

    /* --------------------------------------------------------
     * POST REQUEST
     * (registerPhone / played)
     * ------------------------------------------------------ */
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
