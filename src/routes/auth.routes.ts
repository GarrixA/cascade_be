import express from "express";
import auth from "../controllers/auth.controller";
import athenticate from "../middlewares/authMiddleware";
import userMiddleware from "../middlewares/user_middleware";
import otpIsValid from "../middlewares/otp";

const router = express.Router();

router.get(
  "/",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.getUsers
);
router.get(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.getUserById
);
router.delete(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.deleteUser
);
router.patch(
  "/:id",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.updateUser
);

router.get("/account/verify/:token", auth.accountVerify);
router.post("/2fa/:token", otpIsValid, auth.two_factor_authentication);

router.post("/login", userMiddleware.isLogin_valid, auth.login);

router.post("/register", userMiddleware.isRegister_valid, auth.registerUser);

router.patch(
  "/:userId/assign-organization",
  athenticate.authenticateUser,
  athenticate.isAdmin,
  auth.assignUserOrganization
);

export default router;
