import Joi from "joi";

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500),
    status: Joi.string()
        .lowercase()
        .valid("todo", "in-progress", "done")
        .required(),
    priority: Joi.string()
        .lowercase()
        .valid("low", "medium", "high")
        .required(),
    assignedTo: Joi.array().items(Joi.string()).default([]),
    startTime: Joi.date().required(),
    endTime: Joi.date().greater(Joi.ref("startTime")).required(),
});

export { taskSchema };
