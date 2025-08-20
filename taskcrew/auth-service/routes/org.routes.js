import express from 'express';
import { addOrganization, getOrganizations,addNewOrganization,deleteOrganization } from '../controllers/org.controllers.js';
import { validateRequest } from '../middlewares/validationRequest.js';
import { addOrganizationSchema ,addNewOrganizationSchema} from "../validations/authSchema.js"
import { verifyToken } from '../middlewares/jwt.js';

const router = express.Router({ mergeParams: true });

router.post("/add-organization", validateRequest(addOrganizationSchema), addOrganization);
router.post("/addNewOrganization",verifyToken,validateRequest(addNewOrganizationSchema), addNewOrganization);
router.get("/get-organizations", verifyToken, getOrganizations);
router.delete("/delete-organization/:id", validateRequest(addOrganizationSchema), deleteOrganization);

export default router;
