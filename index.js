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
// // async function connectToDatabase() {
// //   if (isConnected) return;
// //   await mongoose.connect(process.env.MONGO_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   });
// //   isConnected = true;
// // }
// let cachedDb = null;

// async function connectToDatabase(uri) {
//   if (cachedDb) {
//     return cachedDb;
//   }

//   const mongoose = require("mongoose");
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   cachedDb = mongoose.connection;
//   return cachedDb;
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

// module.exports = (req, res) => {
//   res.status(200).json({ message: "Backend is working!" });
// };
// ------------------------------------------------------------------------------------------------
// ruuning on server 8000
// const express = require("express");
// const cors = require("cors");
// const { google } = require("googleapis");
// const mongoose = require("mongoose");
// require("dotenv").config(); // Load environment variables from .env

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
//   credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // Parsing the JSON string from environment variable
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// // Cache MongoDB connection
// let cachedDb = null;

// async function connectToDatabase(uri) {
//   if (cachedDb) {
//     return cachedDb;
//   }

//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   cachedDb = mongoose.connection;
//   return cachedDb;
// }

// // DB Events
// mongoose.connection.on("connected", () => console.log("MongoDB connected"));
// mongoose.connection.on("error", (err) =>
//   console.error("MongoDB connection error:", err)
// );

// // 🧪 Test route
// app.get("/api/test", (req, res) => {
//   res.status(200).json({ message: "Test route working!" });
// });

// // 📥 Registration route
// app.post("/api", async (req, res) => {
//   try {
//     const { name, email } = req.body;
//     console.log(`Received: name=${name}, email=${email}`);

//     // Connect to DB (ensure connection is made)
//     await connectToDatabase(process.env.MONGO_URI);

//     // Google Sheets client
//     const client = await auth.getClient();
//     const sheets = google.sheets({ version: "v4", auth: client });

//     // Append data to Google Sheets
//     await sheets.spreadsheets.values.append({
//       spreadsheetId: process.env.SHEET_ID,
//       range: "Sheet1!A:B",
//       valueInputOption: "RAW",
//       requestBody: { values: [[name, email]] },
//     });

//     // Save data to MongoDB
//     const newUser = new User({ name, email });
//     await newUser.save();

//     res.status(200).json({ message: "Saved successfully!" });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Listen on a port (for local or traditional deployment)
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// // ----------------------------------------------------------------------------------------------------------------

require("dotenv").config(); // Load env vars
const express = require("express");
const cors = require("cors");

const { connectToDatabase, saveUser } = require("./models/mongo");
const { appendToSheet } = require("./models/sheets");

const app = express();
app.use(cors());
app.use(express.json());

// 🧪 Test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test route working!" });
});

// 📥 Registration route
app.post("/api", async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(`Received: name=${name}, email=${email}`);

    await connectToDatabase(process.env.MONGO_URI);
    await appendToSheet(name, email);
    await saveUser({ name, email });

    res.status(200).json({ message: "Saved successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
