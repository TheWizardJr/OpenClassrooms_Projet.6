const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const header = req.header("Authorization");
  if (header == null) return res.status(403).send({ message: "Invalide" });
  const token = header.split(" ")[1];
  if (token == null)
    return res.status(403).send({ message: "Le token ne peut pas être null" });
  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Token invalide !" + err });
    next();
  });
}

module.exports = { authenticateUser };
