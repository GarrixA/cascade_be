import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/httpRceptions";
import { userValidate, validateLogIn } from "../validations/user_validation";

const isRegister_valid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body) {
      const { error } = userValidate(req.body);
      if (error) {
        sendResponse(
          res,
          400,
          "BAD REQUEST",
          error.details[0].message.replace(/"/g, "")
        );
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: "SERVER FAIL",
      message: "Something went wrong!!",
      error: error,
    });
  }
};

const isLogin_valid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = validateLogIn(req.body);

  if (error) {
    sendResponse(
      res,
      400,
      "BAD REQUEST",
      error.details[0].message.replace(/"/g, "")
    );
  }

  next();
};

export default { isRegister_valid, isLogin_valid };
