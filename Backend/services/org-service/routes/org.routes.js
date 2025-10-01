import express from 'express';
import { allOrganizations, getOrganization, addOrganization, editOrganization, deleteOrganization, inviteMembers, deleteMember,acceptInvite} from "../controllers/org.controller.js";
import { organizationSchema } from "../validations/orgSchema.js"
import validateRequest from "../middlewares/validationRequest.js";
import authenticate from '../middlewares/authenticate.js';

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router
    .route("/organization")
    .get(allOrganizations)
    .post(validateRequest(organizationSchema), addOrganization);

router
    .route("/organization/:id")
    .get(getOrganization)
    .put(validateRequest(organizationSchema), editOrganization)
    .delete(deleteOrganization)

router
    .route("/invite/:id")
    .post(inviteMembers)
    .delete(deleteMember)

router
.route("/accept-invite/:id")
.get(acceptInvite);


export default router;