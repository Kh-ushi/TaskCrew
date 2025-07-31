import express from 'express';
import { register, login, logout, refreshToken, tokenVerification } from '../controllers/auth.controllers.js';

const router = express.Router({ mergeParams: true });
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get("/verify-token", tokenVerification);

// router.post("/auth")

export default router;