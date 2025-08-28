import express from "express";
import authRoutes from "./auth.routes";
import roleRoute from "./role.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import organizationRoutes from "./organization.routes";
import translateRoutes from "./translate.routes";

const router = express.Router();

router.use("/", organizationRoutes);
router.use("/", roleRoute);
router.use("/users", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/", translateRoutes);

export default router;
