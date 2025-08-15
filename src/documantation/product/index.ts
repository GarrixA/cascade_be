import { responses } from "../responses";

const product_routes = {
  create_product: {
    tags: ["Product"],
    summary: "Create Product",
    security: [],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "Spoiled food" },
              description: {
                type: "string",
                example: "The food was spoiled and inedible.",
              },
              email: { type: "string", example: "user@example.com" },
              phone_number: { type: "string", example: "+1234567890" },
              images: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary",
                },
              },
              categoryId: { type: "string", example: "uuid-category-id" },
            },
            required: ["name", "description", "email", "images", "categoryId"],
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
};
