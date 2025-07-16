import express from 'express';
import dotenv from 'dotenv';
import { createProject, listMyProjects, getProject, updateProject, modifyMembers,archiveProject} from "./controllers/project.controller.js";
import { verifyToken } from '../middleware/auth.js';

dotenv.config();
const router = express.Router();

router.use(verifyToken);

router.post('/', createProject);
router.get('/my', listMyProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.patch('/:id/memebers', modifyMembers);
router.delete('/:id',archiveProject);

export default router;