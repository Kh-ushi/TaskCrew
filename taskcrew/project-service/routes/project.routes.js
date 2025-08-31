import express from 'express';
import dotenv from 'dotenv';
import { createProject, listMyProjects, getProject, updateProject, modifyMembers,archiveProject,deleteProject} from "../controllers/project.controller.js";
import { verifyToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validationRequest.js';
import { projectSchema } from '../validations/projectSchema.js';

dotenv.config();
const router = express.Router({mergeParams:true});

router.use(verifyToken);

router.post('/:spaceId', validateRequest(projectSchema), createProject);
router.get('/my/:spaceId', listMyProjects);
router.get('/:id', getProject);
router.put('/:id', validateRequest(projectSchema), updateProject);
router.patch('/:id/memebers', modifyMembers);
router.delete('/:id',archiveProject);
router.delete("/hard-delete/:id",deleteProject);

export default router;