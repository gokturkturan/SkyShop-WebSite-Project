import express from "express";
import productController from "../controllers/product.js";
import { isAuth, isAdmin } from "../middleware/authHandler.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(isAuth, isAdmin, productController.createProduct);
router.get("/:id", productController.getProduct);

export default router;
