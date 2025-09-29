import express from "express";
import { register,login,verifyToken} from "../controllers/auth.controller.js";
import {registerSchema,loginSchema} from "../validations/authSchema.js";
import validateRequest from "../middlewares/validationRequest.js";

const router=express.Router({mergeParams:true});

router.post("/register",validateRequest(registerSchema),register);
router.post("/login",validateRequest(loginSchema),login);
router.get("/verify",verifyToken);

export default router;
