import { responses } from "../responses";

const role_routes = {
  read_all: {
    tags: ["Role"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Get Roles",
    consumes: ["application/json"],
    responses,
  },
  read_single: {
    tags: ["Role"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Get Single Role",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the role to retrieve",
        schema: {
          type: "string",
        },
      },
    ],
    responses,
  },
  create_role: {
    tags: ["Role"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Create Role",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              roleName: {
                type: "string",
                example: "MANAGER",
              },
            },
          },
        },
      },
    },
    responses,
  },
  Assign_role: {
    tags: ["Role"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Assign role user",
    parameters: [
      {
        in: "path",
        name: "userId",
        required: true,
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              roleName: {
                type: "string",
                required: true,
                example: "USER",
              },
            },
          },
        },
      },
    },
    responses,
  },
  Edit_role: {
    tags: ["Role"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Edit Role",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              roleName: {
                type: "string",
                required: true,
                example: "MANAGER",
              },
            },
          },
        },
      },
    },
    responses,
  },
  Delete_role: {
    tags: ["Role"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Delete Role",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
      },
    ],
    responses,
  },
};

export const roles = {
  "/api/v1/roles": {
    get: role_routes["read_all"],
  },
  "/api/v1/roles/": {
    post: role_routes["create_role"],
  },
  "/api/v1/users/{userId}/roles": {
    post: role_routes["Assign_role"],
  },
  "/api/v1/roles/{id}": {
    get: role_routes["read_single"],
    patch: role_routes["Edit_role"],
    delete: role_routes["Delete_role"],
  },
};
