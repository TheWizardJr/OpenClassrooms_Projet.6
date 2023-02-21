// Connection à la base de donnée mongoose
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const password = process.env.DB_PASSWORD;
const username = process.env.DB_USERNAME;

const uri = `mongodb+srv://${username}:${password}@cluster0.ygycrtd.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(uri)
  .then(() => console.log("Connecté à Mongo !"))
  .catch((err) => console.error("Erreur de connection à Mongo : ", err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
