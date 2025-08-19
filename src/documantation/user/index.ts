import { responses } from "../responses";

const user_routes = {
  register: {
    tags: ["User"],
    summary: "Register user",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                example: "email@example.com",
              },
              firstName: {
                type: "string",
                example: "kalake",
              },
              lastName: {
                type: "string",
                example: "kalisa",
              },
              password: {
                type: "string",
                example: "passwordQWE123",
              },
              confirmPassword: {
                type: "string",
                example: "passwordQWE123",
              },
            },
            required: [
              "email",
              "firstName",
              "lastName",
              "password",
              "confirmPassword",
            ],
          },
        },
      },
    },
    responses,
  },

  login: {
    tags: ["User"],
    summary: "Login user",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                example: "email@example.com",
              },
              password: {
                type: "string",
                example: "passwordQWE123",
              },
            },
            required: ["email", "password"],
          },
        },
      },
    },
    responses,
  },

  logout: {
    tags: ["User"],
    summary: "Logout user",
    security: [{ bearerAuth: [] }],
    responses,
  },

  get_all: {
    tags: ["User"],
    summary: "Get all users",
    security: [{ bearerAuth: [] }],
    responses,
  },

  get_single: {
    tags: ["User"],
    summary: "Get user by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses,
  },

  delete_user: {
    tags: ["User"],
    summary: "Delete user by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses,
  },

  update_user: {
    tags: ["User"],
    summary: "Update user by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            description: "Fields to update",
            properties: {
              firstName: {
                type: "string",
                example: "NewFirst",
              },
              lastName: {
                type: "string",
                example: "NewLast",
              },
              phone_number: {
                type: "string",
                example: "0780000000",
              },
            },
          },
        },
      },
    },
    responses,
  },

  verify_account: {
    tags: ["User"],
    summary: "Verify account via token",
    parameters: [
      {
        in: "path",
        name: "token",
        required: true,
        schema: {
          type: "string",
        },
        description: "Verification token",
      },
    ],
    responses,
  },

  two_factor_auth: {
    tags: ["User"],
    summary: "Verify user login with OTP (2FA)",
    parameters: [
      {
        in: "path",
        name: "token",
        required: true,
        schema: {
          type: "string",
        },
        description: "2FA authentication token",
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              otp: {
                type: "string",
                example: "123456",
                description: "One Time Password sent to the user",
              },
            },
            required: ["otp"],
          },
        },
      },
    },
    responses,
  },

  assign_organization: {
    tags: ["User", "Organization"],
    summary: "Assign an organization to a user (SELLER only)",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "userId",
        required: true,
        schema: { type: "string" },
        description: "User ID",
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              organization_name: {
                type: "string",
                example: "cascade Org",
              },
            },
            required: ["organization_name"],
          },
        },
      },
    },
    responses,
  },
};

export const users = {
  "/api/v1/users/register": {
    post: user_routes["register"],
  },
  "/api/v1/users/login": {
    post: user_routes["login"],
  },
  "/api/v1/users/logout": {
    post: user_routes["logout"],
  },
  "/api/v1/users": {
    get: user_routes["get_all"],
  },
  "/api/v1/users/{id}": {
    get: user_routes["get_single"],
    delete: user_routes["delete_user"],
    patch: user_routes["update_user"],
  },
  "/api/v1/users/account/verify/{token}": {
    get: user_routes["verify_account"],
  },
  "/api/v1/users/2fa/{token}": {
    post: user_routes["two_factor_auth"],
  },
  "/api/v1/users/{userId}/assign-organization": {
    patch: user_routes["assign_organization"],
  },
};
