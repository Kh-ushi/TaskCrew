import express from 'express';
import { verifyToken } from "../middlewares/jwt.js";
import { validateRequest } from '../middlewares/validationRequest.js';
import { spaceSchema, inviteMembersSchema } from '../validations/spaceSchema.js';
import { createSpace, getSpaces, deleteSpace, inviteMembersToSpace } from '../controllers/space.controllers.js';

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.post("/create-space", validateRequest(spaceSchema), createSpace);
router.get("/get-spaces", getSpaces);
router.delete("/delete-space/:spaceId", validateRequest(spaceSchema), deleteSpace);
router.post("/invite-members/:spaceId", validateRequest(inviteMembersSchema), inviteMembersToSpace);
export default router;
