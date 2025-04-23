const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

let isConnected;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;
    await connectDB();
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(200).json({ message: "Saved to MongoDB" });
  } catch (error) {
    console.error("MongoDB Error:", error);
    res.status(500).json({ error: "MongoDB save failed" });
  }
};
