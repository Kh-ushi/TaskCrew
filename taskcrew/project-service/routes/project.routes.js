import express from 'express';
import dotenv from 'dotenv';
import {createProject} from "./controllers/project.controller.js";

dotenv.config();
const router = express.Router();
router.post('/', createProject);

export default router;