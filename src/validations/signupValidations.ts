import Joi from "joi";

export const signupSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  role: Joi.string().uuid().default("USER"),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
});
