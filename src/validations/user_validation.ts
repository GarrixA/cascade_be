import Joi from "joi";

const register_validater = Joi.object({
  userName: Joi.string(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  isVerified: Joi.boolean(),
  email: Joi.string().email().required().messages({
    "string.empty": "Email field can't empty",
    "string.email": "Invalid Email",
  }),
  password: Joi.string()
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
    .messages({
      "string.empty": "Password field can't be empty",
      "string.pattern.base":
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
    })
    .required(),

  confirmPassword: Joi.string().required().equal(Joi.ref("password")).messages({
    "any.only": "Password don't match",
  }),
  role: Joi.string(),
}).options({ allowUnknown: false });

const logInValidation = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": "Email field can't be empty!",
    "string.email": "Invalid email!",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password field can't be empty!",
  }),
}).options({ allowUnknown: false });

export const validateLogIn = (body: any) => {
  const { error } = logInValidation.validate(body);
  return error;
};

export const userValidate = (user: any) => {
  return register_validater.validate(user);
};
