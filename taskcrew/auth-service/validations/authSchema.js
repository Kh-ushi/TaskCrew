import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    organizationId: Joi.string()
});

const addOrganizationSchema = Joi.object({
    orgName: Joi.string().min(2).required(),
    ownerName: Joi.string().min(2).required(),
    ownerEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    domain: Joi.string().allow(null).allow(""),
    phoneNumber: Joi.string().min(10),
});

const addNewOrganizationSchema = Joi.object({
    orgName: Joi.string().min(2).required(),
    domain: Joi.string().allow(null).allow(""),
});

const inviteMembersSchema = Joi.object({
    emails: Joi.array().items(Joi.string().email()).required(),
    role: Joi.string().valid("admin", "member", "viewer").default("member"),
    message: Joi.string().allow(null).allow(""),
});

export {loginSchema, registerSchema ,addOrganizationSchema,addNewOrganizationSchema,inviteMembersSchema};