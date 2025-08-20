import express from 'express';
import { addOrganization, getOrganizations, addNewOrganization, deleteOrganization, inviteMembers } from '../controllers/org.controllers.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { addOrganizationSchema, addNewOrganizationSchema, inviteMembersSchema } from "../validations/authSchema.js"
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router({ mergeParams: true });

router.post("/add-organization", validateRequest(addOrganizationSchema), addOrganization);
router.post("/addNewOrganization", verifyToken, validateRequest(addNewOrganizationSchema), addNewOrganization);
router.get("/get-organizations", verifyToken, getOrganizations);
router.delete("/delete-organization/:id", validateRequest(addOrganizationSchema), deleteOrganization);
router.post("/invite-members/:id", verifyToken, validateRequest(inviteMembersSchema), inviteMembers);

export default router;
