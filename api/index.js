// const express = require("express");
// const cors = require("cors");
// const { google } = require("googleapis");
// const mongoose = require("mongoose");

// // Create Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Schema
// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });
// const User = mongoose.models.User || mongoose.model("User", UserSchema);

// // Google Sheets Auth
// const auth = new google.auth.GoogleAuth({
//   credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // from .env
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// let isConnected; // Track MongoDB connection

// // DB Events
// mongoose.connection.on("connected", () => console.log("MongoDB connected"));
// mongoose.connection.on("error", (err) =>
//   console.error("MongoDB connection error:", err)
// );

// // DB Connect
// async function connectToDatabase() {
//   if (isConnected) return;
//   await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   isConnected = true;
// }

// // 🧪 Test route
// app.get("/api/test", (req, res) => {
//   res.status(200).json({ message: "Test route working!" });
// });

// // 📥 Registration route
// app.post("/api", async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     console.log(`Received: name=${name}, email=${email}`);

//     await connectToDatabase();

//     const client = await auth.getClient();
//     const sheets = google.sheets({ version: "v4", auth: client });

//     await sheets.spreadsheets.values.append({
//       spreadsheetId: process.env.SHEET_ID,
//       range: "Sheet1!A:B",
//       valueInputOption: "RAW",
//       requestBody: { values: [[name, email]] },
//     });

//     const newUser = new User({ name, email });
//     await newUser.save();

//     res.status(200).json({ message: "Saved successfully!" });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // ✅ Export for Vercel (this is important!)
// // const serverless = require("serverless-http");
// // module.exports = serverless(app); // Default export required by Vercel

// const serverless = require("serverless-http");

// module.exports = async (req, res) => {
//   const handler = serverless(app);
//   return handler(req, res);
// };

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB schema
const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// MongoDB connection (only once per cold start)
let conn = null;
async function connectToDatabase() {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return conn;
}

// Test route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Test route working!" });
});

// POST route (no Google Sheets for now)
app.post("/api", async (req, res) => {
  try {
    const { name, email } = req.body;
    await connectToDatabase();
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(200).json({ message: "Saved successfully!" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = serverless(app); // Required for Vercel
