import express from "express";
import productController from "../controllers/product.js";
import { isAuth, isAdmin } from "../middleware/authHandler.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(isAuth, isAdmin, productController.createProduct);
router
  .route("/:id")
  .get(productController.getProduct)
  .put(isAuth, isAdmin, productController.editProduct)
  .delete(isAuth, isAdmin, productController.deleteProduct);

router.route("/:id/reviews").post(isAuth, productController.sendProductReview);

export default router;
