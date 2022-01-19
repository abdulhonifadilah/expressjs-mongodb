const router = require("express").Router();
const multer = require("multer");
const controllers = require('./controllers')

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

router.get("/product", controllers.index);
router.get("/product/:id", controllers.view);
router.post('/product',upload.single('image'), controllers.store);
router.put('/product/:id',upload.single('image'), controllers.update);
router.delete('/product/:id', controllers.destroy);





module.exports=router;