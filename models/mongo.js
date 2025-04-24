// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({ name: String, email: String });
// const User = mongoose.models.User || mongoose.model("User", UserSchema);

// let isConnected;

// async function connectDB() {
//   if (isConnected) return;
//   await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   isConnected = true;
// }

// module.exports = async (req, res) => {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { name, email } = req.body;
//     await connectDB();
//     const newUser = new User({ name, email });
//     await newUser.save();
//     res.status(200).json({ message: "Saved to MongoDB" });
//   } catch (error) {
//     console.error("MongoDB Error:", error);
//     res.status(500).json({ error: "MongoDB save failed" });
//   }
// };


// mongo.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = mongoose.connection;

  mongoose.connection.on("connected", () => console.log("MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

  return cachedDb;
}

async function saveUser({ name, email }) {
  const newUser = new User({ name, email });
  await newUser.save();
}

module.exports = {
  connectToDatabase,
  saveUser,
};


