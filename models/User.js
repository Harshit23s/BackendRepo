const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({
      name: String,
      email: String,
    })
  );
