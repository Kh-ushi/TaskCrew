import Joi from "joi";

const createTaskSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required",
    }),

    description: Joi.string().trim().allow("").max(1000).messages({
        "string.max": "Description must be at most 1000 characters",
    }),

    assignedTo: Joi.array()
        .items(
            Joi.string().trim()),


    status: Joi.string()
        .valid("to-do", "in-progress", "done")
        .default("to-do")
        .required()
        .messages({
            "any.only": "Status must be one of [todo, in-progress, done]",
        }),

    priority: Joi.string()
        .valid("low", "medium", "high")
        .default("medium")
        .required()
        .messages({
            "any.only": "Priority must be one of [low, medium, high]",
        }),

    startDate: Joi.date().iso().required().messages({
        "date.base": "Start date must be a valid ISO date",
        "any.required": "Start date is required",
    }),

    endDate: Joi.date().iso().min(Joi.ref("startDate")).allow(null).messages({
        "date.min": "End date cannot be before start date",
    }),
});

const editTaskSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow("").max(1000),
    assignedTo: Joi.array()
        .items(Joi.string().trim().required())
        .messages({
            "array.base": "AssignedTo must be an array",
        }),
    status: Joi.string().valid("todo", "in-progress", "done"),
    priority: Joi.string().valid("low", "medium", "high"),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")),
}).min(1);


const addAssigneeSchema = Joi.object({
    assignees: Joi.array()
        .items(
            Joi.string().trim().required().messages({
                "string.empty": "Assignee ID cannot be empty",
            })
        )
        .min(1)
        .required()
        .messages({
            "array.base": "Assignees must be an array",
            "array.min": "At least one assignee is required",
            "any.required": "Assignees field is required",
        }),
});



export { createTaskSchema, addAssigneeSchema, editTaskSchema };