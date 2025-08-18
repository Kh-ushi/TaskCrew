import express from 'express';
import { addOrganization, getOrganizations,deleteOrganization } from '../controllers/org.controllers.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { addOrganizationSchema } from "../validations/authSchema.js"
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router({ mergeParams: true });

router.post("/add-organization", validateRequest(addOrganizationSchema), addOrganization);
router.get("/get-organizations", verifyToken, getOrganizations);
router.delete("/delete-organization/:id", validateRequest(addOrganizationSchema), deleteOrganization);

export default router;
