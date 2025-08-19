import Joi from "joi";

const spaceSchema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
    description: Joi.string().allow(null).allow("").max(1024),
    icon: Joi.string().allow(null).allow(""),
    visibility: Joi.string().valid("org", "private").default("org"),
    inviteEmails: Joi.array().items(Joi.string().email()).default([]),

    members: Joi.array().items(
        Joi.object({
            userId: Joi.string().required(),
            role: Joi.string().valid("admin", "member", "viewer").default("member")
        })
    ).default([]),

    settings: Joi.object({
        allowGuests: Joi.boolean(),
        whoCanCreateSpaces: Joi.string().valid("admins", "members"),
        defaultTaskStatuses: Joi.array().items(Joi.string().min(1)).min(1)
    }).default({})

});

export { spaceSchema };