import Joi from "joi";

const registerSchema=Joi.object({
   name:Joi.string().min(2).required(),
   email:Joi.string().email().required(),
   password:Joi.string().min(6).required(),
});

const loginSchema=Joi.object({
   email:Joi.string().email().required(),
   password:Joi.string().required(),
});

export {registerSchema,loginSchema};