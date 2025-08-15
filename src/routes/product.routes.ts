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

const router = express.Router();

router.post("/", fileUpload.array("images"), isProductValid, createProduct);

router.get("/", getProducts);

router.get("/products/organization", athenticate.authenticateUser);

router.get("/:id", isProductIdValid, getProductById);

router.patch(
  "/:id/availability",
  athenticate.authenticateUser,
  athenticate.isSeller,
  changeProductAvailability
);

// router.patch(
//   "/:productId/assign-organization"
//   isProductIdValid,
// );

export default router;
