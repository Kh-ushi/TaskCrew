import express from "express";
import validationRequest from "../middlewares/validationRequest.js";
import { getAllProjects, getProjectById, createProject, editProject, deleteProject, addMember, deleteMember } from "../controllers/project.controller.js";
import { createSchema, addMembersSchema, editSchema } from "../validations/projectSchema.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router
    .route("/space/:spaceId")
    .get(getAllProjects)
    .post(validationRequest(createSchema), createProject)

router
    .route("/:id/member/memberId")
    .delete(deleteMember)

router
    .route("/:id")
    .get(getProjectById)
    .post(validationRequest(addMembersSchema), addMember)
    .put(validationRequest(editSchema), editProject)
    .delete(deleteProject)


export default router;
