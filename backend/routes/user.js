import express from "express";
import userController from "../controllers/user.js";
import { isAuth, isAdmin } from "../middleware/authHandler.js";

const router = express.Router();

router.get("/all", isAuth, isAdmin, userController.getAllUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", isAuth, userController.logout);
router
  .route("/profile")
  .get(isAuth, userController.getProfile)
  .put(isAuth, userController.updateProfile);
router
  .route("/:id")
  .get(isAuth, isAdmin, userController.getUser)
  .put(isAuth, isAdmin, userController.updateUser)
  .delete(isAuth, isAdmin, userController.deleteUser);

export default router;
