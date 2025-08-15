import { Request, Response, NextFunction } from "express";
import {
  productSchema,
  productIdSchema,
} from "../validations/productValidations";

export const isProductValid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, email, categoryId } = req.body;
  const files = req.files as Express.Multer.File[];

  const errors = [];
  if (!name) errors.push("Name is required");
  if (!description) errors.push("Description is required");
  if (!email) errors.push("Email is required");
  if (!categoryId) errors.push("Category ID is required");
  if (!files || files.length < 1) errors.push("Images are required");

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(", ") });
  }
  next();
};

export const isProductIdValid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = productIdSchema.validate({ id: req.params.id });
  if (error) {
    res
      .status(400)
      .json({ message: error.details[0].message.replace(/"/g, "") });
    return;
  }
  next();
};
