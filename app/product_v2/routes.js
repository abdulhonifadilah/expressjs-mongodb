const router = require("express").Router();
const multer = require("multer");
const controllersProduct = require('./controllers')

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

router.get("/product", controllersProduct.index);
router.get("/product/:id", controllersProduct.view);
router.post("/product", upload.single("image"), controllersProduct.store);
router.put("/product/:id", upload.single('image') , controllersProduct.update);
router.delete('/product/:id', controllersProduct.destroy)


module.exports = router;
