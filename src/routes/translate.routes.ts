import express from "express";
import athenticate from "../middlewares/authMiddleware";
import {
  createProductTranslation,
  getProductTranslations,
  getProductTranslationById,
  updateProductTranslation,
  deleteProductTranslation,
} from "../controllers/product_translation.controller";

const router = express.Router();

// Create translation
router.post("/translate", createProductTranslation);

// Get all translations
router.get("/translate", getProductTranslations);

// Get translation by ID
router.get("/translate/:id", getProductTranslationById);

// Update translation
router.put("/translate/:id", updateProductTranslation);

// Delete translation
router.delete("/translate/:id", deleteProductTranslation);

export default router;
