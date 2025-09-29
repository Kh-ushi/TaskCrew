import Joi from "joi";

const spaceSchema = Joi.object({
    name: Joi.string().min(2).required(),
    description:Joi.string().max(1000),
    members:Joi.array().items(Joi.string().email())
});

export {spaceSchema};