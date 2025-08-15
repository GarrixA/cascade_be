import { Request, Response } from "express";
import database_models from "../database/config/db.config";
import { sendResponse } from "../utils/httpRceptions";

const { Role, User } = database_models;

/**
 * A controller function to create a new role.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @throws {Error} If there is an error creating the role.
 */
const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roleName } = req.body;
    const upperCaseRoleName = roleName.toUpperCase();
    const newRole = await Role.create({ roleName: upperCaseRoleName });

    sendResponse(
      res,
      201,
      "SUCCESS",
      `${upperCaseRoleName} role created successfully`,
      newRole
    );
  } catch (error) {
    console.error("Error creating role:", error);
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

/**
 * A controller function to get all roles.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @throws {Error} If there is an error retrieving the roles.
 */

const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.findAll();
    sendResponse(res, 200, "SUCCESS", "Roles fetched successfully", roles);
  } catch (error) {
    console.error("Error retrieving roles:", error);
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

/**
 * A controller function to get a role by ID.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @throws {Error} If there is an error retrieving the role.
 */

const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      sendResponse(res, 404, "NOT FOUND", "Role not found");
      return;
    }
    sendResponse(res, 200, "SUCCESS", "Role fetched successfully", role);
  } catch (error) {
    console.error("Error retrieving role:", error);
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

/**
 * A controller function to update a role.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @throws {Error} If there is an error updating the role.
 */

const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    const role = await Role.findByPk(id);
    if (!role) {
      sendResponse(res, 404, "NOT FOUND", "Role not found");
      return;
    }
    (role as any).roleName = roleName;
    const updatedRole = await role.save();
    sendResponse(
      res,
      200,
      "SUCCESS",
      `Role ${(updatedRole as any).roleName} updated successfully`,
      updatedRole
    );
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

/**
 * A controller function to assign a role to a user.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @throws {Error} If there is an error assigning the role.
 */

const assignRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roleName } = req.body;
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      sendResponse(res, 404, "NOT FOUND", "User not found");
      return;
    }

    const role = await Role.findOne({ where: { roleName } });
    if (!role) {
      sendResponse(res, 404, "NOT FOUND", "Role not found");
      return;
    }

    (user as any).role = (role as any).id;
    await user.save();

    const userData = {
      ...user.toJSON(),
      password: undefined,
      confirmPassword: undefined,
    };

    sendResponse(
      res,
      200,
      "SUCCESS",
      `Role ${(role as any).roleName} assigned successfully to ${
        userData.lastName
      }`,
      userData
    );
  } catch (error) {
    console.error("Error assigning role to user:", error);
    sendResponse(res, 500, "ERROR", "Internal server error");
    return;
  }
};

/**
 * A controller function to delete a role.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @throws {Error} If there is an error deleting the role.
 */

const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      sendResponse(res, 404, "NOT FOUND", "Role not found");
      return;
    }
    const roleName = (role as any).roleName;
    await role.destroy();
    sendResponse(res, 200, "SUCCESS", `${roleName} Role deleted successfully`);
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

export default {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRole,
};
