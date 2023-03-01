const { app, express } = require("./server");
const { saucesRouter } = require("./routers/sauces.router");
const { authRouter } = require("./routers/auth.router");
const port = 3000;
const path = require("path");

// Connection à la base de données
require("./mongo");

// Middleware
app.use('/api/sauces', saucesRouter);
app.use('/api/auth', authRouter);

// Routes
app.get("/", (req, res) => res.send("Hello World"));

//Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () =>
  console.log(`Exemple d'application écoutant sur le port ${port}`)
);
