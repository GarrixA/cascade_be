import { Request, Response } from "express";
import { sendResponse } from "../utils/httpRceptions";
import { read_function, insert_function } from "../utils/db_methods";

interface OrganizationAttributes {
  id?: string;
  organization_name: string;
}

// Create Organization
export const createOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { organization_name } = req.body;
    const existingOrg = await read_function<OrganizationAttributes | null>(
      "Organization" as any,
      "findOne",
      { where: { organization_name } }
    );
    if (existingOrg) {
      sendResponse(res, 409, "CONFLICT", "Organization already exists");
      return;
    }
    const newOrg = await insert_function<OrganizationAttributes>(
      "Organization" as any,
      "create",
      { organization_name }
    );
    sendResponse(
      res,
      201,
      "SUCCESS",
      "Organization created successfully",
      newOrg
    );
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

// Get all Organizations
export const getOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orgs = await read_function<OrganizationAttributes[]>(
      "Organization" as any,
      "findAll"
    );
    sendResponse(
      res,
      200,
      "SUCCESS",
      "Organizations fetched successfully",
      orgs
    );
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
    return;
  }
};

// Get single Organization by ID
export const getOrganizationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const org = await read_function<OrganizationAttributes | null>(
      "Organization" as any,
      "findOne",
      { where: { id } }
    );
    if (!org) {
      sendResponse(res, 404, "NOT FOUND", "Organization not found");
      return;
    }
    sendResponse(res, 200, "SUCCESS", "Organization fetched successfully", org);
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

// Update Organization
export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_name } = req.body;
    const org = await read_function<OrganizationAttributes | null>(
      "Organization" as any,
      "findOne",
      { where: { id } }
    );
    if (!org) {
      sendResponse(res, 404, "NOT FOUND", "Organization not found");
      return;
    }
    await insert_function<OrganizationAttributes>(
      "Organization" as any,
      "update",
      { organization_name },
      { where: { id } }
    );
    sendResponse(res, 200, "SUCCESS", "Organization updated successfully");
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};

// Delete Organization
export const deleteOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const org = await read_function<OrganizationAttributes | null>(
      "Organization" as any,
      "findOne",
      { where: { id } }
    );
    if (!org) {
      sendResponse(res, 404, "NOT FOUND", "Organization not found");
      return;
    }
    await read_function<any>("Organization" as any, "destroy", {
      where: { id },
    });
    sendResponse(res, 200, "SUCCESS", "Organization deleted successfully");
  } catch (error) {
    sendResponse(res, 500, "ERROR", "Internal server error");
  }
};
