import express from "express";
import productController from "../controllers/product.js";
import { isAuth, isAdmin } from "../middleware/authHandler.js";
import { checkObjectId } from "../middleware/checkObjectId.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(isAuth, isAdmin, productController.createProduct);
router.route("/topProducts").get(productController.getTopProducts); // **
router
  .route("/:id")
  .get(checkObjectId, productController.getProduct)
  .put(isAuth, isAdmin, checkObjectId, productController.editProduct)
  .delete(isAuth, isAdmin, checkObjectId, productController.deleteProduct);
router
  .route("/:id/reviews")
  .post(isAuth, checkObjectId, productController.sendProductReview);

export default router;
