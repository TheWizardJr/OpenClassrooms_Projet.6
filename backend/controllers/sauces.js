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
    .then((sauce) => deleteImageWhenModify(sauce, hasNewImage))
    .catch((error) => res.status(500).send({ message: error }));
}

function makePayload(hasNewImage, req) {
  if  (!hasNewImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImgUrl(req, req.file.fileName);
  return payload;
}

function sendClientResponse(sauce, res) {
  if (sauce == null) return res.status(404).send({ message: "Sauce non trouvée" });
  return Promise.resolve(res.status(200).send({ message: "Sauce modifiée avec succès" }))
  .then(() => sauce);
}

function deleteSauce(req, res) {
  const { id } = req.params;
  Sauce.findByIdAndDelete(id)
    .then((sauce) => deleteImage(sauce))
    .then((sauce) => res.send({ message: sauce }))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(sauce) {
  const imageToDelete = sauce.imageUrl;
  const fileToDelete = imageToDelete.split("/")[4];
  return unlink(`images/${fileToDelete}`);
}

function deleteImageWhenModify(sauce, hasNewImage) {
  if (!hasNewImage) return
  const imageToDelete = sauce.imageUrl;
  const fileToDelete = imageToDelete.split("/")[4];
  return unlink (`images/${fileToDelete}`);
}

function makeImgUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

function likeSauce(req, res) {
  const { id } = req.params;
  const { userId, like } = req.body;
  Sauce.findById(id)
    .then((sauce) => {
      if (like === 1) {
        sauce.likes++;
        sauce.usersLiked.push(userId);
      } else if (like === -1) {
        sauce.dislikes++;
        sauce.usersDisliked.push(userId);
      } else {
        if (sauce.usersLiked.includes(userId)) {
          sauce.likes--;
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
        } else if (sauce.usersDisliked.includes(userId)) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
        }
      }
      sauce
        .save()
        .then((sauce) => res.status(200).send({ message: sauce }))
        .catch((error) => res.status(500).send({ message: error }));
    })
    .catch((error) => res.status(500).send({ message: error }));
}

module.exports = { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce };
