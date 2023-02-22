const { Sauce } = require("../mongo");

function getSauces(req, res) {
  Sauce.find({})
    .then((sauces) => res.send(sauces))
    .catch((error) => res.status(500).send(error));
}

function getSaucesById(req, res) {
    const { id } = req.params;
    Sauce.findById(id)
    .then((sauce) => res.status(200).send(sauce))
    .catch((error) => res.status(500).send(error));
}

function createSauces(req, res) {
  const { body, file } = req;
  const { fileName } = file;
  const bodySauce = JSON.parse(req.body.sauce);
  const { userId, name, manufacturer, description, mainPepper, heat } = bodySauce;
  const sauce = new Sauce({
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
  sauce
    .save()
    .then((message) => {
      res.status(201).send({ message: message });
      return console.log("Produit enregistré", message);
    })
    .catch((error) => res.status(500).send(error));
}

function makeImgUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

module.exports = { getSauces, createSauces, getSaucesById };
