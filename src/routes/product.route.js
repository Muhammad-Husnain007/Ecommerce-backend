
import { Router } from "express";
import { deleteProduct, getAllProducts, getProductById, updateProduct, uploadPrduct } from "../controllers/product.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();
// productRouter.use(verifyJwt)

productRouter
  .route("/upload-product")
  .post(
    upload.fields([{ name: "images", maxCount: 5 }]),
    uploadPrduct
  );
productRouter.route("/")
.get(getAllProducts)
productRouter.route("/:productId")
.get(getProductById)
.delete(deleteProduct)
.put(
     upload.fields([{ name: "images", maxCount: 5 }]),
    updateProduct)


export default productRouter;