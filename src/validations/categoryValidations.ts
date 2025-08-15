import Joi from "joi";

export const categorySchema = Joi.object({
  categoryName: Joi.string().min(3).max(50).required(),
  organizationId: Joi.string().min(24).max(50).required(),
});
