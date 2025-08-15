import { Request, Response, NextFunction } from "express";
import { categorySchema } from "../validations/categoryValidations";

export const isCategoryValid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    res
      .status(400)
      .json({ message: error.details[0].message.replace(/"/g, "") });
    return;
  }
  next();
};
