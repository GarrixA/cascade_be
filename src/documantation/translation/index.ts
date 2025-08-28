import { responses } from "../responses";

const translation_routes = {
  create_translation: {
    tags: ["Translation"],
    security: [{ bearerAuth: [] }],
    summary: "Create Product Translation",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              productId: { type: "string", example: "uuid" },
              language: { type: "string", example: "fr" },
              title: { type: "string", example: "Produit" },
              description: {
                type: "string",
                example: "Description en français",
              },
            },
          },
        },
      },
    },
    responses,
  },
  read_all: {
    tags: ["Translation"],
    security: [{ bearerAuth: [] }],
    summary: "Get All Product Translations",
    responses,
  },
  read_single: {
    tags: ["Translation"],
    security: [{ bearerAuth: [] }],
    summary: "Get Product Translation By ID",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the translation to retrieve",
        schema: { type: "string" },
      },
    ],
    responses,
  },
  update_translation: {
    tags: ["Translation"],
    security: [{ bearerAuth: [] }],
    summary: "Update Product Translation",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the translation to update",
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
              title: { type: "string", example: "Produit modifié" },
              description: { type: "string", example: "Nouvelle description" },
            },
          },
        },
      },
    },
    responses,
  },
  delete_translation: {
    tags: ["Translation"],
    security: [{ bearerAuth: [] }],
    summary: "Delete Product Translation",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the translation to delete",
        schema: { type: "string" },
      },
    ],
    responses,
  },
};

export const translations = {
  "/api/v1/translate": {
    post: translation_routes["create_translation"],
    get: translation_routes["read_all"],
  },
  "/api/v1/translate/{id}": {
    get: translation_routes["read_single"],
    put: translation_routes["update_translation"],
    delete: translation_routes["delete_translation"],
  },
};
