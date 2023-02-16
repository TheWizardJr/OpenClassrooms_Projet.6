// Ajout d'express
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Exemple d'application écoutant sur le port ${port}`);
})

// Connection à la base de donnée mongoose
const mongoose = require('mongoose');
const uri = "mongodb+srv://TheWizardJr:8WOaCFd9HEYhiLOg@cluster0.ygycrtd.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri)
  .then((() => console.log("Connecté à Mongo !")))
  .catch(err => console.error("Erreur de connection à Mongo : ",err))