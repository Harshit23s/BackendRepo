const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model("User", userSchema);

// // mongodb+srv://<db_username>:<db_password>@registrationapp.xwelvel.mongodb.net/?retryWrites=true&w=majority&appName=RegistrationApp

