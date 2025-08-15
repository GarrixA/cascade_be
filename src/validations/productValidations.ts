import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),

  description: Joi.string().min(3).max(500).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 3 characters",
    "string.max": "Description must not exceed 500 characters",
    "any.required": "Description is required",
  }),

  status: Joi.string()
    .valid("pending", "resolved", "in_progress")
    .required()
    .messages({
      "any.only":
        'Status must be one of "pending", "resolved", or "in_progress"',
      "any.required": "Status is required",
      "string.empty": "Status is required",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  phone_number: Joi.string().allow(null, "").messages({
    "string.base": "Phone number must be a string",
  }),

  images: Joi.array()
    .items(
      Joi.string().uri().messages({
        "string.uri": "Each image must be a valid URI",
      })
    )
    .required()
    .messages({
      "array.base": "Images must be an array",
      "any.required": "Images are required",
    }),

  categoryId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "Category ID must be a valid UUIDv4",
      "any.required": "Category ID is required",
      "string.empty": "Category ID is required",
    }),
});

export const productIdSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "ID must be a valid UUIDv4",
      "string.empty": "ID is required",
      "any.required": "ID is required",
    }),
});
