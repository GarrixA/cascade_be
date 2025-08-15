import { HttpException } from "../utils/httpRceptions";
import { Request, Response, NextFunction } from "express";
import validateOtp from "../validations/otp.Validate";

const otpIsValid = (req: Request, res: Response, next: NextFunction) => {
  try {
    const error = validateOtp(req.body);
    if (error) {
      res
        .status(400)
        .json(
          new HttpException(
            "BAD REQUEST",
            error.details[0].message.replace(/"/g, "")
          )
        );
      return;
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

export default otpIsValid;
