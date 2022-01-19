const { ObjectId } = require("mongodb");
const db = require("../../config/mongodb");
const fs = require("fs");

const index = (req, res) => {
  db.collection("product")
    .find()
    .toArray()
    .then((result) => {
      res.send({
        status: "success",
        data: result,
      });
    })
    .catch((err) => res.json(err));
};

const view = (req, res) => {
  const { id } = req.params;
  db.collection("product")
    .findOne({ _id: ObjectId(id) })
    .then((result) => {
      res.send({
        status: "success",
        data: result,
      });
    })
    .catch((err) => res.json(err));
};

const store = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;
  let body = { name, price, stock, status, image_url: "" };
  if (image) {
    body = {
      name,
      price,
      stock,
      status,
      image_url: "uploads/" + image.filename,
    };
  }
  db.collection("product")
    .insertOne(body)
    .then((result) =>
      res.json({
        status: "success",
        data: result,
      })
    )
    .catch((err) => res.josn(err));
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;
  const data = await db.collection("product").findOne({ _id: ObjectId(id) });
  let body = { name, price, stock, status, image_url: "" };
  if (image) {
    body = {
      name,
      price,
      stock,
      status,
      image_url: "uploads/" + image.filename,
    };
  }
  await db
    .collection("product")
    .updateOne({ _id: ObjectId(id) }, { $set: body }, { upsert: true })
    .then((result) => {
      res.json(result);
      if (image) {
        removeImage(data.image_url);
      }
    })
    .catch((err) => res.json(err));
};

const destroy = async (req, res) => {
  const { id } = req.params;
  const data = await db.collection("product").findOne({ _id: ObjectId(id) });
  await db.collection('product').deleteOne({_id: ObjectId(id)}).then(result=>{
      removeImage(data.image_url)
      res.json(result)
  }).catch(err=>res.json(err))
};

const removeImage = (fileName) => {
  fs.unlink(fileName, (err) => {
    if (err) {
      console.log('data sudah dihapus');
    }
    console.log("delete file sucess");
  });
};
module.exports = { index, view, store, update, destroy };
