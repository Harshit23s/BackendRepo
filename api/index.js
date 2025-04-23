const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
  })
);

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // Using ENV variable instead of secret.json
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Route
app.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:B",
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, email]],
      },
    });

    // Save to MongoDB
    const newUser = new User({ name, email });
    await newUser.save();

    res.status(200).json({ message: "Saved successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DO NOT USE app.listen() on Vercel
module.exports = app;

