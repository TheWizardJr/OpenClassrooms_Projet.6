const { Sauce } = require("../mongo");
const unlink = require("fs").promises.unlink;

function getSauces(req, res) {
  Sauce.find({})
    .then((sauces) => res.send(sauces))
    .catch((error) => res.status(500).send(error));
}

function getSauceById(req, res) {
  const { id } = req.params;
  Sauce.findById(id)
    .then((sauce) => res.status(200).send(sauce))
    .catch((error) => res.status(500).send(error));
}

function createSauce(req, res) {
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
    .then((sauce) => res.status(201).send({ message: sauce }))
    .catch((error) => res.status(500).send({ message: error }));
}

function modifySauce(req, res) {
  const { id } = req.params;
  const hasNewImage = req.file != null;
  const payload = makePayload(hasNewImage, req)
  Sauce.findByIdAndUpdate(id, payload)
    .then((sauce) => sendClientResponse(sauce, res))
    .catch((error) => res.status(500).send({ message: error }));
}

function makePayload(hasNewImage, req) {
  if  (!hasNewImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImgUrl(req, req.file.fileName);
  return payload;
}

function sendClientResponse(sauce, res) {
  if (sauce == null) {
   return res.status(404).send({ message: "Sauce non trouvée" });
  }
  res.status(200).send({ message: "Sauce modifiée avec succès" });
}

function deleteSauce(req, res) {
  const { id } = req.params;
  Sauce.findByIdAndDelete(id)
    .then(deleteImage)
    .then((sauce) => res.send({ message: sauce }))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(sauce) {
  const imageUrl = sauce.imageUrl;
  const fileToDelete = imageUrl.split("/")[4];
  return unlink(`images/${fileToDelete}`).then(() => sauce);
}

function makeImgUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

module.exports = { getSauces, createSauce, getSauceById, deleteSauce, modifySauce };
