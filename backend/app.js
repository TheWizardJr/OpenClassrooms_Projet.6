require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

// Connection à la base de données
require('./mongo');

// Controllers
const {createUser, logUser} = require('./controllers/users');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/", (req, res) => res.send("Hello World"));

//Listen
app.listen(port, () => console.log(`Exemple d'application écoutant sur le port ${port}`));