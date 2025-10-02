import express from "express";
import { register,login,verifyToken,getMembersInfo} from "../controllers/auth.controller.js";
import {registerSchema,loginSchema} from "../validations/authSchema.js";
import validateRequest from "../middlewares/validationRequest.js";
import authenticate from "../middlewares/authenticate.js";

const router=express.Router({mergeParams:true});

router.post("/register",validateRequest(registerSchema),register);
router.post("/login",validateRequest(loginSchema),login);
router.get("/verify",verifyToken);
router.post("/members-info",authenticate,getMembersInfo);

export default router;
