const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const mongoose = require("mongoose");

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // from .env
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

let isConnected; // Track MongoDB connection

// DB Events
mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection error:", err)
);

// DB Connect
// async function connectToDatabase() {
//   if (isConnected) return;
//   await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   isConnected = true;
// }
let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoose = require("mongoose");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = mongoose.connection;
  return cachedDb;
}


// 🧪 Test route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Test route working!" });
});

// 📥 Registration route
app.post("/api", async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(`Received: name=${name}, email=${email}`);

    await connectToDatabase();

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:B",
      valueInputOption: "RAW",
      requestBody: { values: [[name, email]] },
    });

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(200).json({ message: "Saved successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Export for Vercel (this is important!)
// const serverless = require("serverless-http");
// module.exports = serverless(app); // Default export required by Vercel

const serverless = require("serverless-http");

module.exports = async (req, res) => {
  const handler = serverless(app);
  return handler(req, res);
};

