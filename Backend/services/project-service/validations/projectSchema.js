import Joi from "joi";

const createSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().allow("").max(500),
    status: Joi.string().valid("active", "archived").default("active"),
    state: Joi.string().valid("to-do", "in-progress", "completed").default("to-do"),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref("startDate"))
});


const addMembersSchema = Joi.object({
    members: Joi.array()
        .items(Joi.string().trim().required())
        .min(1)
        .required()
        .messages({
            "array.base": "Members must be an array",           // if members is not an array
            "array.min": "At least one member is required",    // if array is empty []
            "any.required": "Members array is required",       // if 'members' is missing completely
            "string.empty": "Member ID cannot be empty",       // if one of the array elements is an empty string
        }),
});


const editSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow("").max(500),
    status: Joi.string().valid("active", "archived"),
    state: Joi.string().valid("to-do", "in-progress", "completed").default("to-do"),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref("startDate"))
});


export { createSchema, addMembersSchema, editSchema };