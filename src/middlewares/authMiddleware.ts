import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../database/models/User";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  console.log("authHeader");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthoriz" });
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

    if (req.user.role !== "SELLER") {
      res.status(403).json({ message: "Access denied. Sellers only." });
      return;
    }

    if (req.user.isPasswordExpired) {
      res.status(403).json({ message: "Password has expired, update it!" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in isSeller middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { authenticateUser, isAdmin, isSeller };
