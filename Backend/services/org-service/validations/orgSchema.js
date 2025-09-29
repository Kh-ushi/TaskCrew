import Joi from "joi";

const organizationSchema=Joi.object({
    name:Joi.string().min(2).required(),
    description:Joi.string().max(1000),
    members:Joi.array().items(Joi.string().email())
});

export {organizationSchema};
