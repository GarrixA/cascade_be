import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import athenticate from "../middlewares/authMiddleware";
import { isCategoryValid } from "../middlewares/categoryMiddleware";

const router = express.Router();

router.post(
  "/",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  isCategoryValid,
  createCategory
);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.patch(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  isCategoryValid,
  updateCategory
);

router.delete(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  deleteCategory
);

export default router;
