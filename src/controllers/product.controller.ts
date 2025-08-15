import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { uploadMultiple } from "../helpers/upload";
import { category_utils } from "../utils/controller";
import { insert_function, read_function } from "../utils/db_methods";
import { sendResponse } from "../utils/httpRceptions";

interface ProductAttributes {
  id?: string;
  title: string;
  description: string;
  images: string[];
  categoryId: string;
  status: string;
  isAvailable?: boolean;
}

interface ExpandRequest extends Request {
  user?: JwtPayload;
}

let product_id;

// Create Product
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as ExpandRequest).user;
    const sellerId = user?.id;

    const files = req.files as Express.Multer.File[];
    const { title, description, categoryId, isAvailable } = req.body;
    const product_condition = { where: { title, sellerId } };

    if (!title || !description || !categoryId) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Required fields are missing!"
      );
      return;
    }

    // Check if categoryId exists
    const category = await read_function<any>("Category" as any, "findOne", {
      where: { id: categoryId },
    });
    if (!category) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Provided categoryId does not exist."
      );
      return;
    }

    const productExist = await read_function<ProductAttributes>(
      "Products",
      "findOne",
      product_condition
    );

    if (productExist) {
      sendResponse(
        res,
        409,
        "CONFLICT",
        "Product already exists, you can update it instead!"
      );
      return;
    }

    const uploadedImages = await uploadMultiple(files, req);

    if ((req as any).info?.message) {
      sendResponse(res, 400, "VALIDATION_ERROR", (req as any).info.message);
      return;
    }

    const productData: ProductAttributes = {
      title,
      description,
      categoryId,
      images: uploadedImages.images,
      status: "New",
    };

    const product = await insert_function<ProductAttributes>(
      "Products" as any,
      "create",
      productData
    );

    sendResponse(res, 201, "SUCCESS", "Product created successfully", product);
  } catch (error) {
    console.log("Error creating product:", error);
    if (error instanceof ValidationError) {
      const messages = error.errors.map((e) => e.message);
      sendResponse(res, 400, "VALIDATION_ERROR", messages.join(", "));
    } else {
      sendResponse(
        res,
        500,
        "ERROR",
        (error as Error).message || "Internal server error"
      );
    }
  }
};

// Get all Products
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as ExpandRequest).user;
    const sellerId = user?.id;

    let products;

    if (user?.role === "SELLER") {
      products = await read_function<ProductAttributes>("Products", "findAll", {
        where: { sellerId },
      });
    } else {
      products = await read_function<ProductAttributes>("Products", "findAll", {
        where: { isAvailable: true },
      });
    }

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Products fetched successfully!",
      products
    );
  } catch (error) {
    console.log(error);
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      error as Error
    );
  }
};

// Get single Product by ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    product_id = category_utils(req, res).getId;
    const isValidUUID = category_utils(req, res).isValidUUID(product_id);
    if (!isValidUUID) return;

    const user = (req as ExpandRequest).user;
    const sellerId = user?.id;

    let product;

    if (user?.role === "SELLER") {
      product = await read_function<ProductAttributes>("Products", "findOne", {
        where: { id: product_id, sellerId },
      });
    } else {
      product = await read_function<ProductAttributes>("Products", "findOne", {
        where: { id: product_id, isAvailable: true },
      });
    }

    if (!product) {
      sendResponse(res, 404, "NOT FOUND", "Product not found or not owned!");
      return;
    }

    sendResponse(res, 200, "SUCCESS", "Product fetched successfully!", product);
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
  }
};

// Change Product Availability
export const changeProductAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as ExpandRequest).user;
    const sellerId = user?.id;
    const productId = req.params.id;
    const { isAvailable } = req.body;

    if (!productId || typeof isAvailable !== "boolean") {
      sendResponse(res, 400, "VALIDATION_ERROR", "Product ID  are required.");
      return;
    }

    // Check if product exists and belongs to seller
    const product = await read_function<ProductAttributes>(
      "Products",
      "findOne",
      {
        where: { userId: sellerId, id: productId },
      }
    );

    if (!product) {
      sendResponse(res, 404, "NOT FOUND", "Product not found");
      return;
    }

    // Update availability
    await insert_function(
      "Products",
      "update",
      { isAvailable },
      { where: { id: productId } }
    );

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Product availability updated successfully."
    );
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
  }
};
