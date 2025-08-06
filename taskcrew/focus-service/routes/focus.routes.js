import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../middleware/auth.js';
import { viewProject, pinProject, getDashboard, getOverload } from '../controllers/focus.controller.js';

dotenv.config();
const router = express.Router({mergeParams:true});

router.use(verifyToken);

router.post('/view/:projectId', viewProject);
router.post('/pin/:projectId', pinProject);
router.get('/dashboard/:userId', getDashboard);
router.get('/overload/:userId', getOverload);

export default router;

