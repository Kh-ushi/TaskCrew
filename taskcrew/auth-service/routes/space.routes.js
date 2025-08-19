import express from 'express';
import { verifyToken } from "../middlewares/jwt.js";
import { validateRequest } from '../middlewares/validationRequest.js';
import { spaceSchema } from '../validations/spaceSchema.js';
import { createSpace, getSpaces ,deleteSpace} from '../controllers/space.controllers.js';

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.post("/create-space", validateRequest(spaceSchema), createSpace);
router.get("/get-spaces", getSpaces);
router.delete("/delete-space/:id", validateRequest(spaceSchema), deleteSpace);

export default router;
