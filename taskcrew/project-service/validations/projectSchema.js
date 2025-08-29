import Joi from "joi";

const projectSchema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
    description: Joi.string().allow(null).allow("").max(1024),
    members: Joi.array().items(
        Joi.object({
            userId: Joi.string().required(),
            role: Joi.string().valid("admin", "member", "viewer").default("member")
        })
    ).default([]),
    status: Joi.string().valid("active", "archived").default("active"),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
});

export {projectSchema};
