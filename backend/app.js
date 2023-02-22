const { app, express } = require("./server");
const port = 3000;
const path = require("path");

// Connection à la base de données
require("./mongo");

// Controllers
const { createUser, logUser } = require("./controllers/users");
const { getSauces, createSauces, getSaucesById } = require("./controllers/sauces");

// Middleware
const { authenticateUser } = require("./middleware/auth");
const { upload } = require("./middleware/multer");

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authenticateUser, getSauces);
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauces);
app.get("/api/sauces/:id", authenticateUser, getSaucesById);
app.get("/", (req, res) => res.send("Hello World"));

//Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () =>
  console.log(`Exemple d'application écoutant sur le port ${port}`)
);
