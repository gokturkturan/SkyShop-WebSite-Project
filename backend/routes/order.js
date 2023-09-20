import express from "express";
import orderController from "../controllers/order.js";
import { isAuth, isAdmin } from "../middleware/authHandler.js";

const router = express.Router();

router
  .route("/")
  .get(isAuth, isAdmin, orderController.getAllOrders)
  .post(isAuth, orderController.createOrder);
router.get("/myOrders", isAuth, orderController.getUserOrders);
router.get("/:id", isAuth, orderController.getOrder);
router.put("/:id/pay", isAuth, orderController.updateOrderToPaid);
router.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  orderController.updateOrderToDelivered
);

export default router;
