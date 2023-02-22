const { Product } = require("../mongo");

function getSauces(req, res) {
  Product.find({}).then((sauces) => res.send(sauces));
}

function createSauces(req, res) {
  const { body, file } = req;
  const { fileName } = file;
  const sauce = JSON.parse(req.body.sauce);
  const { userId, name, manufacturer, description, mainPepper, heat } = sauce;
  const product = new Product({
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    imageUrl: makeImgUrl(req, fileName),
    heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((message) => {
      res.status(201).send({ message: message });
      return console.log("Produit enregistré", message);
    })
    .catch(console.error);
}

function makeImgUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

module.exports = { getSauces, createSauces };
