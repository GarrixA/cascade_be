import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  changeProductAvailability,
} from "../controllers/product.controller";
import athenticate from "../middlewares/authMiddleware";
import {
  isProductIdValid,
  isProductValid,
} from "../middlewares/productMiddleware";
import fileUpload from "../middlewares/multers";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/",
  fileUpload.array("images"),
  // isProductValid,
  athenticate.authenticateUser,
  athenticate.isSeller,
  createProduct
);

router.get("/", getProducts);

// router.get("/products/organization", athenticate.authenticateUser);

router.get("/:id", getProductById);

router.patch(
  "/:id/availability",
  athenticate.authenticateUser,
  athenticate.isSeller,
  changeProductAvailability
);

export default router;
