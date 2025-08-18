import express from 'express';
import { register, login, logout, refreshToken, tokenVerification } from '../controllers/auth.controllers.js';
import {validateRequest} from '../middlewares/validationRequest.js';
import { registerSchema ,loginSchema} from '../validations/authSchema.js';

const router = express.Router({ mergeParams: true });
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get("/verify-token", tokenVerification);

// router.post("/auth")

export default router;