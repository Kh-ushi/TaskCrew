import Joi from "joi";

const projectSchema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
    description: Joi.string().allow(null).allow("").max(1024),
    members: Joi.array().items(Joi.string().email()).min(1).required(),
    status: Joi.string().valid("active", "archived").default("active"),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
});

export {projectSchema};
