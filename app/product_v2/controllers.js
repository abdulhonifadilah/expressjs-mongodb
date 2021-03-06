const fs = require("fs");
const Product = require("./model");

const index =(req, res) => {
    Product.find()
      .then((result) =>
        res.json({
          status: "success",
          data: result,
        })
      )
      .catch((err) => res.json(err));
  }

const view = (req, res) => {
    const { id } = req.params;
    Product.findById(id)
      .then((result) =>
        res.json({
          status: "success",
          data: result,
        })
      )
      .catch((err) =>
        res.json({
          status: "not found",
          message: "data tidak ada",
        })
      );
  }

  const store =(req, res) => {
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
    Product.create(body)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  }

  const update =(req, res) => {
    const { name, price, stock, status } = req.body;
    const image = req.file;
    const {id}= req.params;
    let body = { name, price, stock, status };
    if (image) {
      body = {
        name,
        price,
        stock,
        status,
        image_url: "uploads/" + image.filename,
      };
    }
    Product.findById(id).then(result=>{
      if(image){
        removeImage(result.image_url);
      }
      Product.findByIdAndUpdate(id, body, (err, doc)=>{
        if(err){
          res.json(err)
        }else{
          res.json({
            status: 'success',
            message: `${name} berhasil di update`
          })
        }
      })
    }).catch(()=>{
      res.status(400).json({
        status: 'failed',
        message: `${name} gagal di update`
      })
    })
  }

  const destroy = (req, res)=>{
    const {id}= req.params;
    Product.findOneAndDelete(id)
    .then(result=>{
      removeImage(result.image_url);
      res.json({
        status: 'success',
        message : 'hapus data berhasil'
      })
    })
    .catch(err => res.json(err));
  }

  const removeImage = (fileName) => {
    fs.unlink(fileName, (err) => {
      if (err) {
        console.log('file sudah dihapus');
      }
      console.log("delete file sucess");
    });
  };
  



module.exports = { index, view, store, update, destroy}