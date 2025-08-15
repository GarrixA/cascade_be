import { Request, Response, NextFunction } from "express";
import { organizationSchema } from "../validations/organizationValidations";

export const isOrganizationValid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = organizationSchema.validate(req.body);
  if (error) {
    res
      .status(400)
      .json({ message: error.details[0].message.replace(/"/g, "") });
    return;
  }
  next();
};
