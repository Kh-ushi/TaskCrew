import express from "express";
import {allSpaces,getSpace,createSpace, editSpace, deleteSpace,inviteMembers,deleteMember,acceptInvite} from "../controllers/space.controller.js";
import { spaceSchema } from "../validations/spaceSchema.js";
import validateRequest from "../middlewares/validationRequest.js";
import authenticate from "../middlewares/authenticate.js";


const router=express.Router({mergeParams:true});

router.use(authenticate);

router
.route("/:id/space")
.get(allSpaces)
.post(validateRequest(spaceSchema),createSpace)


router
.route("/space/:spaceId")
.get(getSpace)
.put(validateRequest(spaceSchema),editSpace)
.delete(deleteSpace)

router
    .route("/invite-members/:spaceId")
    .post(inviteMembers)
    .delete(deleteMember)

router
     .route("/accept-invite/:spaceId")
     .get(acceptInvite)    

export default router;