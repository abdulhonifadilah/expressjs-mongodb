const router = require("express").Router();
const Product = require("./model");
const multer = require("multer");
const fs = require("fs");
const { route } = require("express/lib/application");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

router.get("/product", (req, res) => {
  Product.find()
    .then((result) =>
      res.json({
        status: "success",
        data: result,
      })
    )
    .catch((err) => res.json(err));
});

router.get("/product/:id", (req, res) => {
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
});
router.post("/product", upload.single("image"), (req, res) => {
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
});

router.put("/product/:id", upload.single('image') ,(req, res) => {
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
});

router.delete('/product/:id', (req, res)=>{
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
})

const removeImage = (fileName) => {
  fs.unlink(fileName, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("delete file sucess");
  });
};

module.exports = router;
