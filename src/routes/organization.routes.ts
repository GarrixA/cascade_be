import express from "express";
import * as organizationController from "../controllers/organization.controller";
import { isOrganizationValid } from "../middlewares/organizationMiddleware";
import athenticate from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/organizations",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  isOrganizationValid,
  organizationController.createOrganization
);

router.get(
  "/organizations",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  organizationController.getOrganizations
);

router.get(
  "/organizations/:id",
  athenticate.authenticateUser,
  organizationController.getOrganizationById
);

router.patch(
  "/organizations/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  isOrganizationValid,
  organizationController.updateOrganization
);

router.delete(
  "/organizations/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  organizationController.deleteOrganization
);

export default router;
