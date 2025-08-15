import Joi from "joi";

export const organizationSchema = Joi.object({
  organization_name: Joi.string().min(3).max(100).required(),
});
