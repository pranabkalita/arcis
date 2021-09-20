import express from "express";

// Controllers
import MeController from "controllers/Auth/Me.Controller.js";
import LoginController from "controllers/Auth/Login.Controller.js";
import LogoutController from "controllers/Auth/Logout.Controller.js";
import RegisterController from "controllers/Auth/Register.Controller.js";
import ResetPasswordController from "controllers/Auth/ResetPassword.Controller.js";
import UpdatePasswordController from "controllers/Auth/UpdatePassword.Controller.js";
import ForgotPasswordController from "controllers/Auth/ForgotPassword.Controller.js";
import EmailVerificationController from "controllers/Auth/EmailVerification.Controller.js";

// validators
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} from "middleware/validators/Auth.Validators";

// Middleware
import AuthMiddleware, {
  IsNotActive,
  IsNotLoggedIn,
} from "middleware/AuthMiddleware";
import { uploadPostImage } from "middleware/ProfilePictureUpload";

// Create the Auth Router
const router = express.Router();

// REGISTER : [POST] /api/v1/auth/register
router.post(
  "/register",
  IsNotLoggedIn,
  registerValidator,
  RegisterController.store
);
// LOGIN : [POST] /api/v1/auth/login
router.post("/login", IsNotLoggedIn, loginValidator, LoginController.store);

// EMAIL VERIFICATION : [GET] /api/v1/auth/email/verify/:token
router.get("/email/verify/:token", EmailVerificationController.show);

// FORGOT PASSWORD : [POST] /api/v1/auth/forgot-password
router.post(
  "/forgot-password",
  IsNotLoggedIn,
  forgotPasswordValidator,
  ForgotPasswordController.store
);

// RESET PASSWORD : [POST] /api/v1/auth/reset-password
router.post(
  "/reset-password/:token",
  IsNotLoggedIn,
  resetPasswordValidator,
  ResetPasswordController.store
);

// Protected Router: Protect all routes after this middleware
router.use(AuthMiddleware);

// GET PROFILE : [GET] /api/v1/auth/me
router.get("/me", MeController.show);

// UPDATE PROFILE : [PUT] /api/v1/auth/me
router.put("/me", uploadPostImage, MeController.update);

// RESEND EMAIL VERIFICATION : [POST] /api/v1/auth/email/verification-notification
router.post(
  "/email/verification-notification",
  IsNotActive,
  EmailVerificationController.store
);

// UPDATE PASSWORD : [PUT] /api/v1/auth/update-password
router.put(
  "/update-password",
  updatePasswordValidator,
  UpdatePasswordController.update
);

// LOGOUT : [POST] /api/v1/auth/logout
router.post("/logout", LogoutController.store);

export default router;
