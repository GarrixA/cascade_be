import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { Category } from "../database/models/Category";
import { ProductTranslation } from "../database/models/ProductTranslation_model";
import { User } from "../database/models/User";
import { generateCode } from "../helpers/generate_code";
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
  status?: string;
  isAvailable?: boolean;
  userId?: string;
  price?: number;
  code?: string;
}

interface ExpandRequest extends Request {
  user?: JwtPayload;
}

const include = [
  {
    model: User,
    as: "user",
    attributes: ["id", "firstName", "lastName", "email", "role"],
  },
  {
    model: ProductTranslation,
    as: "translations",
    attributes: ["language", "title", "description"],
  },
  {
    model: Category,
    as: "category",
    attributes: ["id", "categoryName"],
  },
];

let product_id;

// ========================== CREATE PRODUCT ==========================
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as ExpandRequest).user;
    const sellerId = user?.id;

    const files = req.files as Express.Multer.File[];
    const { title, description, categoryId, price } = req.body;
    const product_condition = { where: { title, userId: sellerId } };

    if (!price || isNaN(Number(price))) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Price must be a valid number!"
      );
      return;
    }

    if (!title || !description || !categoryId) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Required fields are missing!"
      );
      return;
    }

    // Check if category exists
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

    // Check duplicate product
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

    // Upload images
    const uploadedImages = await uploadMultiple(files, req);

    if ((req as any).info?.message) {
      sendResponse(res, 400, "VALIDATION_ERROR", (req as any).info.message);
      return;
    }

    // Create product
    const productData: ProductAttributes = {
      title,
      description,
      categoryId,
      images: uploadedImages.images,
      price,
      status: "New",
      userId: sellerId,
      code: generateCode(),
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

// ========================== GET ALL PRODUCTS ==========================
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as ExpandRequest).user;
    const userId = user?.id;

    const condition_one = { where: { userId }, include };
    const condition_two = { where: { isAvailable: true }, include };
    let products;

    if (user?.Roles?.roleName === "SELLER") {
      products = await read_function<ProductAttributes>(
        "Products",
        "findAll",
        condition_one
      );
    } else {
      products = await read_function<ProductAttributes>(
        "Products",
        "findAll",
        condition_two
      );
    }

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Products fetched successfully!",
      products
    );
  } catch (error) {
    console.error(error);
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      error as Error
    );
  }
};
// ========================== GET PRODUCT BY ID ==========================
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    product_id = category_utils(req, res).getId;
    const isValidUUID = category_utils(req, res).isValidUUID(product_id);
    if (!isValidUUID) {
      return;
    }
    const user = (req as ExpandRequest).user;
    const sellerId = user?.id;
    const condition_one = { where: { id: product_id, sellerId }, include };
    const condition_two = {
      where: { id: product_id, isAvailable: true },
      include,
    };
    let product;

    if (user?.role === "SELLER") {
      product = await read_function<ProductAttributes>(
        "Products",
        "findOne",
        condition_one
      );
      if (!product) {
        sendResponse(res, 404, "NOT FOUND", "Product not found or not owned!");
      }
      sendResponse(
        res,
        200,
        "SUCCESS",
        "Product fetched successfully!",
        product
      );
    } else {
      product = await read_function<ProductAttributes>(
        "Products",
        "findOne",
        condition_two
      );
      if (!product) {
        sendResponse(res, 404, "NOT FOUND", "Product not found or not owned!");
      }

      sendResponse(
        res,
        200,
        "SUCCESS",
        "Product fetched successfully!",
        product
      );
    }
  } catch (error: unknown) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      error as Error
    );
  }
};

// ========================== CHANGE PRODUCT AVAILABILITY ==========================
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
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Product ID and isAvailable flag are required."
      );
      return;
    }

    // Check ownership
    const product = await read_function<ProductAttributes>(
      "Products",
      "findOne",
      {
        where: { userId: sellerId, id: productId },
      }
    );

    if (!product) {
      sendResponse(
        res,
        404,
        "NOT FOUND",
        "Product not found or not owned by you"
      );
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
