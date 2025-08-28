import { responses } from "../responses";

const product_routes = {
  create_product: {
    tags: ["Product"],
    summary: "Create Product",
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string", example: "Spoiled food" },
              description: {
                type: "string",
                example: "The food was spoiled and inedible.",
              },
              images: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary",
                },
              },
              categoryId: { type: "string", example: "uuid-category-id" },
              isAvailable: { type: "boolean", example: true },
              price: { type: "number", example: 49.99 },
              code: { type: "string", example: "A1B2C" }, // 👈 Added code field
            },
            required: [
              "title",
              "description",
              "images",
              "categoryId",
              "price",
              "code",
            ],
          },
        },
      },
    },
    responses,
  },
  read_all: {
    tags: ["Product"],
    security: [{ bearerAuth: [] }],
    summary: "Get all Products",
    responses,
  },
  read_single: {
    tags: ["Product"],
    security: [{ bearerAuth: [] }],
    summary: "Get single Product",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the product to retrieve",
        schema: { type: "string" },
      },
    ],
    responses,
  },
  read_by_organization: {
    tags: ["Product"],
    security: [{ bearerAuth: [] }],
    summary: "Get Products by Organization",
    description:
      "Returns all products where the organizationId matches the authenticated user's organizationId.",
    responses,
  },
  change_availability: {
    tags: ["Product"],
    security: [{ bearerAuth: [] }],
    summary: "Change Product Availability",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the product to update",
        schema: { type: "string" },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              isAvailable: { type: "boolean", example: true },
            },
            required: ["isAvailable"],
          },
        },
      },
    },
    responses,
  },
};

export const products = {
  "/api/v1/products": {
    post: product_routes["create_product"],
    get: product_routes["read_all"],
  },
  "/api/v1/products/organization": {
    get: product_routes["read_by_organization"],
  },
  "/api/v1/products/{id}": {
    get: product_routes["read_single"],
  },
  "/api/v1/products/{id}/availability": {
    patch: product_routes["change_availability"],
  },
};
