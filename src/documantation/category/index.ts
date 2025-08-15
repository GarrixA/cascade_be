import { responses } from "../responses";

const category_routes = {
  create: {
    tags: ["Category"],
    summary: "Create a new category",
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              categoryName: {
                type: "string",
                example: "Food",
              },
              organizationId: {
                type: "string",
                example: "11111111-1111-1111-1111-111111111111",
              },
            },
            required: ["categoryName", "organizationId"],
          },
        },
      },
    },
    responses,
  },
  get_all: {
    tags: ["Category"],
    summary: "Get all categories",
    responses,
  },
  get_single: {
    tags: ["Category"],
    summary: "Get category by ID",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses,
  },
  update: {
    tags: ["Category"],
    summary: "Update category by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
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
              categoryName: {
                type: "string",
                example: "Updated Category",
              },
              organizationId: {
                type: "string",
                example: "11111111-1111-1111-1111-111111111111",
              },
            },
            required: ["categoryName", "organizationId"],
          },
        },
      },
    },
    responses,
  },
  delete: {
    tags: ["Category"],
    summary: "Delete category by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses,
  },
};

export const categories = {
  "/api/v1/categories": {
    post: category_routes.create,
    get: category_routes.get_all,
  },
  "/api/v1/categories/{id}": {
    get: category_routes.get_single,
    patch: category_routes.update,
    delete: category_routes.delete,
  },
};
