import { Request, Response } from "express";
import { sendResponse } from "../utils/httpRceptions";
import { read_function } from "../utils/db_methods";

interface ProductAttributes {
  id?: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  status: string;
  email: string;
  phone_number?: string;
}

// Get Products by Organization
export const getProductsByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    console.log("User from token", user);

    // 1. Fetch user from DB to get organizationId
    const dbUser = await read_function<any>("User" as any, "findOne", {
      where: { id: user.id },
    });
    console.log("dbUser", dbUser);
    if (!dbUser || !dbUser?.dataValues?.organization) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "You are not assigned to any organization."
      );
      return;
    }

    const products = await read_function<ProductAttributes[]>(
      "Products" as any,
      "findAll",
      { where: { organizationId: dbUser.dataValues.organization } }
    );

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Products fetched successfully",
      products
    );
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
    return;
  }
};

// Get single Product by Organization
export const getSingleProductByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Fetch user from DB to get organizationId
    const dbUser = await read_function<any>("User" as any, "findOne", {
      where: { id: user.id },
    });

    if (!dbUser || !dbUser?.dataValues?.organization) {
      sendResponse(
        res,
        400,
        "NOT FOUND",
        "You are not assigned to any organization."
      );
      return;
    }

    // Fetch product by id and organizationId
    const product = await read_function<ProductAttributes | null>(
      "Products" as any,
      "findOne",
      {
        where: {
          id,
          organizationId: dbUser.dataValues.organization,
        },
      }
    );

    if (!product) {
      sendResponse(res, 404, "NOT FOUND", "Product not found");
      return;
    }

    sendResponse(res, 200, "SUCCESS", "Product fetched successfully", product);
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
    return;
  }
};
