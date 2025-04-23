const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Schema
const User = mongoose.model.user || mongoose.model(
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

let isConnected; // Track the connection status

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Function to handle MongoDB connection
async function connectToDatabase() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

// Route
app.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log(`Received request with name: ${name}, email: ${email}`);

    await connectToDatabase(); // Ensure database is connected before proceeding

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    console.log("Attempting to append to Google Sheets...");
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:B",
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, email]],
      },
    });
    console.log("Data successfully appended to Google Sheets.");

    const newUser = new User({ name, email });
    await newUser.save();
    console.log("User successfully saved to MongoDB.");

    res.status(200).json({ message: "Saved successfully!" });
  } catch (err) {
    console.error("Error during execution:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DO NOT USE app.listen() on Vercel
const serverless = require("serverless-http");
module.exports.handler = serverless(app);



