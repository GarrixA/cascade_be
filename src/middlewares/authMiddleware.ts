import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { User } from "../database/models/User";
import database_models from "../database/config/db.config";
import { HttpException, sendResponse } from "../utils/httpRceptions";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface ExpandedRequest extends Request {
  user?: JwtPayload;
}

const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  // console.log("authHeader", req.headers);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"],
    }) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(403).json({ message: "Invalid token!" });
  }
};

const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized access" });
    return;
  }

  try {
    const user = await User.findByPk(req?.user?.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (req.user.role !== "ADMIN") {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    if (req.user.isPasswordExpired) {
      res.status(403).json({ message: "Password has expired, update it!" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const isSeller = async (
  req: ExpandedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
    return;
  }

  const decodedToken = jwt.decode(token) as JwtPayload;
  if (
    decodedToken &&
    decodedToken.exp &&
    Date.now() >= decodedToken.exp * 1000
  ) {
    res
      .status(401)
      .json(
        new HttpException(
          "UNAUTHORIZED",
          "You have been loggedOut, Please login to continue!"
        )
      );
    return;
  }

  try {
    const payLoad = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    req.user = payLoad;

    console.log("Req==============>", req.user.role);

    if (req.user?.role !== "SELLER") {
      res
        .status(403)
        .json(
          new HttpException(
            "FORBIDDEN",
            " Only seller can perform this action!"
          )
        );
      return;
    }

    if (req.user.isPasswordExpired) {
      sendResponse(
        res,
        403,
        "FORBIDDEN",
        "Password has expired, Please update your password!"
      );
      return;
    }

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res
        .status(401)
        .json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
      return;
    } else {
      res
        .status(401)
        .json(new HttpException("UNAUTHORIZED", "Please login to continue!"));
      return;
    }
  }
};

export default { authenticateUser, isAdmin, isSeller };
