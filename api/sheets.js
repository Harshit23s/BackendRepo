const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:B",
      valueInputOption: "RAW",
      requestBody: { values: [[name, email]] },
    });

    res.status(200).json({ message: "Saved to Google Sheets" });
  } catch (error) {
    console.error("Sheets Error:", error);
    res.status(500).json({ error: "Google Sheets save failed" });
  }
};
