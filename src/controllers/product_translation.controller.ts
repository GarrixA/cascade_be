import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { insert_function, read_function } from "../utils/db_methods";
import { sendResponse } from "../utils/httpRceptions";
import { Products } from "../database/models/Product";

interface ProductTranslationAttributes {
  id?: string;
  productId: string; // FK to Product
  language: string; // e.g., "en", "fr", "sw"
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Include Product details in the response
const include = [
  {
    model: Products,
    as: "product",
    attributes: ["id", "title", "code", "isAvailable"],
  },
];

// ========================== CREATE TRANSLATION ==========================
export const createProductTranslation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, language, title, description } = req.body;

    if (!productId || !language || !title || !description) {
      sendResponse(res, 400, "VALIDATION_ERROR", "All fields are required.");
      return;
    }

    // Check product existence
    const product = await read_function<Products | null>(
      "Products" as any,
      "findOne",
      { where: { id: productId } }
    );

    if (!product) {
      sendResponse(res, 404, "NOT FOUND", "Product not found.");
      return;
    }

    // Check duplicate translation
    const existing = await read_function<any>(
      "ProductTranslation" as any,
      "findOne",
      { where: { productId, language } }
    );

    if (existing) {
      sendResponse(
        res,
        409,
        "CONFLICT",
        `Translation already exists for language ${language}`
      );
      return;
    }

    const newTranslation = await insert_function<ProductTranslationAttributes>(
      "ProductTranslation" as any,
      "create",
      { productId, language, title, description }
    );

    sendResponse(
      res,
      201,
      "SUCCESS",
      "Product translation created successfully",
      newTranslation
    );
  } catch (error) {
    console.error("Error creating translation:", error);
    if (error instanceof ValidationError) {
      const messages = error.errors.map((e) => e.message);
      sendResponse(res, 400, "VALIDATION_ERROR", messages.join(", "));
    } else {
      sendResponse(res, 500, "ERROR", "Internal server error");
    }
  }
};

// ========================== GET ALL TRANSLATIONS ==========================
export const getProductTranslations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const translations = await read_function<any>(
      "ProductTranslation" as any,
      "findAll",
      { include }
    );

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Translations fetched successfully",
      translations
    );
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

// ========================== GET TRANSLATION BY ID ==========================
export const getProductTranslationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const translation = await read_function<any>(
      "ProductTranslation" as any,
      "findOne",
      { where: { id }, include }
    );

    if (!translation) {
      sendResponse(res, 404, "NOT FOUND", "Translation not found.");
      return;
    }

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Translation fetched successfully",
      translation
    );
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

// ========================== UPDATE TRANSLATION ==========================
export const updateProductTranslation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const translation = await read_function<any>(
      "ProductTranslation" as any,
      "findOne",
      { where: { id } }
    );

    if (!translation) {
      sendResponse(res, 404, "NOT FOUND", "Translation not found.");
      return;
    }

    await insert_function<any>(
      "ProductTranslation" as any,
      "update",
      { title, description },
      { where: { id } }
    );

    sendResponse(res, 200, "SUCCESS", "Translation updated successfully.");
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

// ========================== DELETE TRANSLATION ==========================
export const deleteProductTranslation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const translation = await read_function<any>(
      "ProductTranslation" as any,
      "findOne",
      { where: { id } }
    );

    if (!translation) {
      sendResponse(res, 404, "NOT FOUND", "Translation not found.");
      return;
    }

    await insert_function<any>(
      "ProductTranslation" as any,
      "destroy",
      {},
      { where: { id } }
    );

    sendResponse(res, 200, "SUCCESS", "Translation deleted successfully.");
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};
